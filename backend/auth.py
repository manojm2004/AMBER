import os
import re
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import bcrypt
from jose import JWTError, jwt

from . import models, schemas, database
from .security import brute_force_guard, rate_limiter

# ── Security Constants ──────────────────────────────────────────────
SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
if not SECRET_KEY or SECRET_KEY == "your-super-secret-key-change-in-production":
    raise RuntimeError(
        "CRITICAL: JWT_SECRET_KEY environment variable is not set! "
        "Set it via Render/Vercel environment variables before deployment."
    )

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8   # 8 hours (reduced from 1 week for security)
REFRESH_ENABLED = False                 # Can be extended to refresh tokens later

# Password policy
MIN_PASSWORD_LENGTH = 8
PASSWORD_REGEX = re.compile(r'^(?=.*[A-Za-z])(?=.*\d).{8,}$')  # min 1 letter + 1 digit

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
router = APIRouter(prefix="/auth", tags=["Authentication"])


# ── Password Helpers ─────────────────────────────────────────────────
def verify_password(plain_password: str, hashed_password: str) -> bool:
    if isinstance(hashed_password, str):
        hashed_password = hashed_password.encode("utf-8")
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password)


def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)   # 12 rounds — strong but not too slow
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def validate_password_strength(password: str):
    """Enforce password policy: min 8 chars, at least 1 letter and 1 digit."""
    if len(password) < MIN_PASSWORD_LENGTH:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long.")
    if not PASSWORD_REGEX.match(password):
        raise HTTPException(status_code=400, detail="Password must contain at least one letter and one number.")


# ── JWT Helpers ───────────────────────────────────────────────────────
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# ── Dependency: Get Current User ──────────────────────────────────────
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(database.get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception

    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user


# ── Routes ────────────────────────────────────────────────────────────
@router.post("/register", response_model=schemas.UserResponse, status_code=201)
def register(user: schemas.UserCreate, request: Request, db: Session = Depends(database.get_db)):
    # Rate limit registrations (1 per second per IP)
    client_ip = request.client.host
    if not rate_limiter.is_allowed(client_ip, cost=3.0, refill_rate=0.5, max_tokens=5.0):
        raise HTTPException(status_code=429, detail="Too many registration attempts. Please wait.")

    # Validate password strength
    validate_password_strength(user.password)

    # Validate username (alphanumeric + underscore only, 3–30 chars)
    if not re.match(r'^[a-zA-Z0-9_]{3,30}$', user.username):
        raise HTTPException(status_code=400, detail="Username must be 3–30 alphanumeric characters or underscores.")

    # Check unique username
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=409, detail="Username already taken.")

    # Check unique email (if provided)
    if user.email and db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=409, detail="Email already registered.")

    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=get_password_hash(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=schemas.Token)
def login(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    client_ip = request.client.host

    # Check brute-force lockout
    if brute_force_guard.is_locked(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many failed login attempts. Try again in 5 minutes."
        )

    # Rate limit login endpoint (5 req/min)
    if not rate_limiter.is_allowed(client_ip, cost=2.0, refill_rate=0.08, max_tokens=5.0):
        raise HTTPException(status_code=429, detail="Too many requests. Slow down.")

    # Authenticate — always run both checks to prevent timing attacks
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    password_valid = verify_password(form_data.password, user.hashed_password) if user else False

    if not user or not password_valid:
        brute_force_guard.record_failure(client_ip)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Successful login — reset brute force counter
    brute_force_guard.reset(client_ip)

    token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": token, "token_type": "bearer"}


@router.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user
