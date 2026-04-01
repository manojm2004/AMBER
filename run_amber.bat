@echo off
echo Starting AMBER (Milk Quality Analysis System)...
call venv\Scripts\activate.bat
echo Virtual environment activated.
echo Launching the web application...
start http://localhost:8501
streamlit run app\app.py
pause
