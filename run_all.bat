@echo off
echo ========================================================
echo                 STARTING ADSVERZ SERVICES
echo ========================================================

echo.
echo Starting Backend (FastAPI) on http://127.0.0.1:8000...
start "Adsverz Backend" cmd /k "cd /d \"%~dp0backend\" && .venv\Scripts\activate.bat && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

echo.
echo Starting Frontend (Vite + React) on http://localhost:5173...
start "Adsverz Frontend" cmd /k "cd /d \"%~dp0frontend\" && npm run dev"

echo.
echo ========================================================
echo  Both services are starting up in separate windows.
echo  - Backend Docs: http://127.0.0.1:8000/docs
echo  - Frontend App: http://localhost:5173
echo ========================================================
pause
