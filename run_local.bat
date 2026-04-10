@echo off
title AMBER - Local Dev Server
echo.
echo  ================================================
echo   AMBER - AI-Driven Milk Bio-Purity System
echo   Starting local development servers...
echo  ================================================
echo.

:: Start Backend in a new window
echo [1/2] Starting Backend (FastAPI on port 8000)...
start "AMBER Backend" cmd /k "cd /d %~dp0 && set JWT_SECRET_KEY=local_dev_secret_key_amber_2024 && call venv\Scripts\activate.bat && python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

:: Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

:: Start Frontend in a new window
echo [2/2] Starting Frontend (Vite on port 5173)...
start "AMBER Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo.
echo  ================================================
echo   Both servers are starting up!
echo.
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:5173
echo   API Docs: http://localhost:8000/docs
echo  ================================================
echo.
echo  Press any key to open the app in your browser...
pause >nul

start http://localhost:5173
