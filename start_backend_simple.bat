@echo off
echo ========================================
echo  Micro Credit Risk Analyzer Backend
echo ========================================
echo.
echo Starting backend server...
echo.

cd /d "%~dp0backend"

echo Installing required packages...
python -m pip install -r requirements_simple.txt --quiet

echo.
echo Creating database and starting server...
python main.py

echo.
echo Backend server stopped.
pause
