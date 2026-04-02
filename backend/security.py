"""
AMBER Security Module
Handles: Rate limiting, brute force protection, file validation,
         path traversal prevention, and security headers.
"""
import os
import time
import hashlib
from collections import defaultdict
from threading import Lock
from fastapi import Request, HTTPException, status
from fastapi.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware

# -------------------------------------------------------------------
# RATE LIMITER — In-memory token bucket per IP
# -------------------------------------------------------------------
class RateLimiter:
    def __init__(self):
        self._buckets: dict = defaultdict(lambda: {"tokens": 10.0, "last": time.time()})
        self._lock = Lock()

    def is_allowed(self, ip: str, cost: float = 1.0, refill_rate: float = 2.0, max_tokens: float = 10.0) -> bool:
        with self._lock:
            bucket = self._buckets[ip]
            now = time.time()
            elapsed = now - bucket["last"]
            bucket["tokens"] = min(max_tokens, bucket["tokens"] + elapsed * refill_rate)
            bucket["last"] = now
            if bucket["tokens"] >= cost:
                bucket["tokens"] -= cost
                return True
            return False

rate_limiter = RateLimiter()

# -------------------------------------------------------------------
# BRUTE FORCE PROTECTION — Login lockout per IP
# -------------------------------------------------------------------
class BruteForceGuard:
    MAX_ATTEMPTS = 5          # max failed logins before lockout
    LOCKOUT_SECONDS = 300     # 5 minute lockout

    def __init__(self):
        self._attempts: dict = defaultdict(lambda: {"count": 0, "locked_until": 0})
        self._lock = Lock()

    def is_locked(self, ip: str) -> bool:
        with self._lock:
            data = self._attempts[ip]
            if data["locked_until"] > time.time():
                return True
            return False

    def record_failure(self, ip: str):
        with self._lock:
            data = self._attempts[ip]
            data["count"] += 1
            if data["count"] >= self.MAX_ATTEMPTS:
                data["locked_until"] = time.time() + self.LOCKOUT_SECONDS
                data["count"] = 0

    def reset(self, ip: str):
        with self._lock:
            self._attempts[ip] = {"count": 0, "locked_until": 0}

brute_force_guard = BruteForceGuard()

# -------------------------------------------------------------------
# FILE UPLOAD VALIDATION
# -------------------------------------------------------------------
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/bmp", "image/gif", "image/tiff"}
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp", ".gif", ".tiff"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

# Real magic bytes for image formats
MAGIC_BYTES = {
    b'\xff\xd8\xff': "image/jpeg",
    b'\x89PNG': "image/png",
    b'BM': "image/bmp",
    b'GIF8': "image/gif",
    b'II*\x00': "image/tiff",
    b'MM\x00*': "image/tiff",
}

def validate_image_file(filename: str, content_type: str, file_bytes: bytes) -> None:
    """Validate uploaded file is a real image — checks extension, MIME type, and magic bytes."""
    # 1. Extension check
    ext = os.path.splitext(filename.lower())[1]
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type '{ext}' not allowed. Upload JPEG, PNG, BMP, GIF or TIFF.")

    # 2. MIME type check
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=400, detail="Invalid content type. Must be an image.")

    # 3. File size check
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")

    # 4. Magic bytes check (prevents disguised executables)
    matched = False
    for magic, _ in MAGIC_BYTES.items():
        if file_bytes[:len(magic)] == magic:
            matched = True
            break
    if not matched:
        raise HTTPException(status_code=400, detail="File content does not match a valid image format.")


def safe_filename(filename: str) -> str:
    """Strip path traversal attempts and dangerous characters from filename."""
    # Remove any directory components
    filename = os.path.basename(filename)
    # Replace dangerous characters
    safe = "".join(c for c in filename if c.isalnum() or c in "._-")
    # Prepend timestamp hash to prevent collisions and enumeration
    prefix = hashlib.sha256(f"{time.time()}".encode()).hexdigest()[:8]
    return f"{prefix}_{safe}" if safe else f"{prefix}_upload"


# -------------------------------------------------------------------
# SECURITY HEADERS MIDDLEWARE
# -------------------------------------------------------------------
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Adds HTTP security headers to every response."""

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        # Prevent MIME sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        # XSS protection (legacy browsers)
        response.headers["X-XSS-Protection"] = "1; mode=block"
        # Enforce HTTPS for 1 year (HSTS)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"
        # Restrict referrer info
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        # Permissions policy — disable dangerous browser APIs
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=(), "
            "payment=(), usb=(), magnetometer=(), gyroscope=()"
        )
        # Content Security Policy
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: blob:; "
            "connect-src 'self' https://*.onrender.com https://*.vercel.app; "
            "frame-ancestors 'none';"
        )
        # Remove server version fingerprint if present
        if "server" in response.headers:
            del response.headers["server"]
        if "x-powered-by" in response.headers:
            del response.headers["x-powered-by"]

        return response
