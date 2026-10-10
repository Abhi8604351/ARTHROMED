@echo off
title ArthroMed Full-Stack Runner
echo ========================================================
echo         Starting ArthroMed Full-Stack Platform
echo ========================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not detected in your PATH.
    echo Please install Node.js from https://nodejs.org/ (LTS version recommended).
    echo After installing, restart your terminal or double-click this script again.
    pause
    exit /b 1
)

echo [1/3] Node.js detected:
node -v
npm -v
echo.

echo [2/3] Starting Backend Server (Port 3000)...
start "ArthroMed Backend (Port 3000)" cmd /k "cd backend && if not exist node_modules (echo Installing backend dependencies... && npm install) && echo Starting Express backend... && npm run dev"

echo [3/3] Starting Frontend Server (Port 4200)...
start "ArthroMed Frontend (Port 4200)" cmd /k "cd frontend && if not exist node_modules (echo Installing frontend dependencies... && npm install) && echo Starting Angular frontend... && npm start"

echo.
echo ========================================================
echo Backend is launching at:  http://localhost:3000/api/products
echo Frontend is launching at: http://localhost:4200
echo ========================================================
echo.
pause
