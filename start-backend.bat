@echo off
title JeevanSetu 2.0 - Backend API (Port 8000)
cd /d "%~dp0backend"
echo ========================================================
echo Starting JeevanSetu 2.0 FastAPI Backend on Port 8000...
echo Swagger Docs: http://localhost:8000/docs
echo Health Check: http://localhost:8000/health
echo ========================================================
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
pause
