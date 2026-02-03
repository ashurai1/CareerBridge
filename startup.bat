@echo off
REM CareerBridge - One Click Startup Script for Windows

color 0a
title CareerBridge - Startup

echo.
echo ========================================
echo   CareerBridge - Project Startup
echo ========================================
echo.

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] MongoDB is not installed or not in PATH
    echo Please install MongoDB from: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)

echo [1/3] Checking MongoDB installation... [OK]

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [2/3] Node.js version: %NODE_VERSION% [OK]

REM Check if npm packages are installed
if not exist "backend\node_modules" (
    echo [WARNING] Backend packages not found. Installing...
    cd backend
    call npm install --legacy-peer-deps
    cd ..
)

if not exist "frontend\node_modules" (
    echo [WARNING] Frontend packages not found. Installing...
    cd frontend
    call npm install --legacy-peer-deps
    cd ..
)

echo [3/3] npm packages verified [OK]
echo.
echo ========================================
echo   READY TO START SERVERS
echo ========================================
echo.
echo This script will open 3 new terminal windows:
echo   1. MongoDB database
echo   2. Backend API server
echo   3. Frontend development server
echo.
pause

REM Open MongoDB in new window
echo Starting MongoDB...
start cmd /k mongod

REM Wait a bit for MongoDB to start
timeout /t 3

REM Open Backend server in new window
echo Starting Backend Server...
cd backend
start cmd /k "npm run dev"
cd ..

REM Wait a bit for Backend to start
timeout /t 3

REM Open Frontend server in new window
echo Starting Frontend Server...
cd frontend
start cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   SERVERS STARTING
echo ========================================
echo.
echo When all 3 windows show ready messages:
echo.
echo MongoDB: "waiting for connections on port 27017"
echo Backend: "Server running in development mode"
echo Frontend: "Local: http://localhost:5173/"
echo.
echo Then open your browser to:
echo   http://localhost:5173
echo.
echo Press any key to close this window...
pause
exit /b 0
