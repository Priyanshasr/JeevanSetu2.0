@echo off
title JeevanSetu 2.0 - Frontend (Port 5173)
cd /d "%~dp0frontend"
echo ========================================================
echo Starting JeevanSetu 2.0 React Frontend on Port 5173...
echo Web App: http://localhost:5173
echo ========================================================
npm run dev -- --host 0.0.0.0 --port 5173
pause
