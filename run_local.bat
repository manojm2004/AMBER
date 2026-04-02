@echo off
title AMBER Local Development Launcher
echo =======================================================
echo          AMBER - Local Development Environment
echo =======================================================
echo.

:: Set local development dummy keys so the security checks pass
set JWT_SECRET_KEY=local-dev-secret-key-1234567890
set ENVIRONMENT=development

:: Check for virtual environment
IF NOT EXIST "venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found in 'venv' folder!
    echo Please create it using: python -m venv venv
    echo And install requirements: pip install -r requirements.txt
    pause
    exit /b 1
)

echo [1/2] Starting FastAPI Backend on port 8000...
:: The 'start' command opens a new command prompt window for the backend
start "AMBER Backend (FastAPI)" cmd /k "call venv\Scripts\activate.bat && set JWT_SECRET_KEY=local-dev-secret-key-1234567890 && set ENVIRONMENT=development && uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000"

echo [2/2] Starting React Vite Frontend on port 5173...
:: Check if node_modules exists
IF NOT EXIST "frontend\node_modules\" (
    echo [INFO] Installing frontend dependencies first...
    cd frontend
    call npm install
    cd ..
)

:: The 'start' command opens another window for the frontend
start "AMBER Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo =======================================================
echo ALL SERVICES STARTED!
echo - Backend API: http://localhost:8000
echo - Frontend UI: http://localhost:5173
echo.
echo Both terminal windows have been launched.
echo To stop the servers, just close those command prompt windows.
echo =======================================================
pause
