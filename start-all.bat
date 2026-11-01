@echo off
title JeevanSetu 2.0 Launcher
echo ========================================================
echo Launching JeevanSetu 2.0 (Backend + Frontend)...
echo ========================================================
start "JeevanSetu 2.0 - Backend" cmd /c "%~dp0start-backend.bat"
timeout /t 3 /nobreak >nul
start "JeevanSetu 2.0 - Frontend" cmd /c "%~dp0start-frontend.bat"
echo.
echo Both servers started!
echo Frontend:     http://localhost:5173
echo Backend API:  http://localhost:8000
echo Swagger Docs: http://localhost:8000/docs
echo.
pause
