import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from starlette.middleware.trustedhost import TrustedHostMiddleware

from . import models
from .database import engine
from .auth import router as auth_router
from .predict import router as predict_router
from .security import SecurityHeadersMiddleware

# ── Bootstrap DB ──────────────────────────────────────────────────────
models.Base.metadata.create_all(bind=engine)

# ── App Instance ──────────────────────────────────────────────────────
app = FastAPI(
    title="AMBER API",
    version="1.0.0",
    # Hide /docs and /redoc in production to reduce attack surface
    docs_url=None if os.environ.get("ENVIRONMENT") == "production" else "/docs",
    redoc_url=None if os.environ.get("ENVIRONMENT") == "production" else "/redoc",
)

# ── Trusted Host Protection ───────────────────────────────────────────
# Prevents Host header injection attacks
ALLOWED_HOSTS = os.environ.get(
    "ALLOWED_HOSTS",
    "localhost,127.0.0.1,*.onrender.com,*.vercel.app"
).split(",")

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])  # Set to ALLOWED_HOSTS in strict mode

# ── Security Headers (must be added BEFORE CORS) ─────────────────────
app.add_middleware(SecurityHeadersMiddleware)

# ── CORS — Strict Allowlist ───────────────────────────────────────────
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Add production origins from environment (set in Render/Vercel dashboard)
if os.environ.get("FRONTEND_URL"):
    ALLOWED_ORIGINS.append(os.environ.get("FRONTEND_URL"))

# Add Vercel preview URLs for development convenience
ALLOWED_ORIGINS.extend([
    "https://amber-snowy.vercel.app",
    "https://amber-git-main-manojm2004.vercel.app",
])

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=r"https://amber[a-z0-9\-]*\.vercel\.app",  # Covers all Vercel preview URLs
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],           # Only methods we actually use
    allow_headers=["Authorization", "Content-Type", "Accept"],
    max_age=600,
)

# ── Global Error Handler (don't leak stack traces) ────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."}
    )

# ── Routers ───────────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(predict_router)

@app.get("/api")
def root():
    return {"message": "AMBER API — Operational.", "version": "1.0.0"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# ── Serve React Frontend (Production SPA) ────────────────────────────
FRONTEND_DIST = os.path.join("frontend", "dist")

if os.path.isdir(FRONTEND_DIST):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")), name="assets")

    @app.api_route("/{path_name:path}", methods=["GET"])
    async def catch_all(request: Request, path_name: str):
        if path_name.startswith(("api/", "auth/")):
            return JSONResponse(status_code=404, content={"detail": "Not found"})
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return JSONResponse(status_code=503, content={"detail": "Frontend not built."})
