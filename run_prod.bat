@echo off
echo ====================================================
echo AMBER PRODUCTION BOOTLOADER
echo Checking Virtual Environment...
echo ====================================================

IF NOT EXIST "venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment 'venv' not found. Please run setup first!
    pause
    exit /b 1
)

call venv\Scripts\activate.bat

echo.
echo [1/2] Verifying Frontend Distribution Build...
IF NOT EXIST "frontend\dist\index.html" (
    echo [ERROR] Frontend production build missing!
    echo Please run 'npm run build' inside the frontend directory before launching production.
    pause
    exit /b 1
)
echo Frontend /dist payload verified OK.

echo.
echo [2/2] Launching 1,000-User Scale Multicore Server...
python start_prod_server.py

pause
