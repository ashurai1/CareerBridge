#!/usr/bin/env powershell
# CareerBridge Complete Setup & Startup Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CareerBridge - Complete Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

# Check if MongoDB is installed
Write-Host "`n[1/5] Checking MongoDB installation..." -ForegroundColor Yellow
$mongoPath = Get-Command mongod -ErrorAction SilentlyContinue
if ($mongoPath) {
    Write-Host "✅ MongoDB found: $($mongoPath.Source)" -ForegroundColor Green
} else {
    Write-Host "❌ MongoDB not found. Please install MongoDB from https://www.mongodb.com/try/download/community" -ForegroundColor Red
    Write-Host "   Or install via Homebrew (Mac) or Chocolatey (Windows)" -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
Write-Host "`n[2/5] Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green

# Check if npm packages are installed
Write-Host "`n[3/5] Checking npm packages..." -ForegroundColor Yellow
if ((Test-Path "backend/node_modules") -and (Test-Path "frontend/node_modules")) {
    Write-Host "✅ All npm packages installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Installing npm packages..." -ForegroundColor Yellow
    cd backend
    npm install --legacy-peer-deps
    cd ../frontend
    npm install --legacy-peer-deps
    cd ..
    Write-Host "✅ npm packages installed" -ForegroundColor Green
}

# Check environment files
Write-Host "`n[4/5] Verifying environment configuration..." -ForegroundColor Yellow
if ((Test-Path "backend/.env") -and (Test-Path "frontend/.env")) {
    Write-Host "✅ Environment files configured" -ForegroundColor Green
} else {
    Write-Host "❌ Missing .env files" -ForegroundColor Red
    exit 1
}

# Ready to start
Write-Host "`n[5/5] System ready!" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  STARTUP INSTRUCTIONS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n📋 You need 3 terminal windows:" -ForegroundColor Cyan

Write-Host "`n1️⃣  TERMINAL 1 - MongoDB:" -ForegroundColor Yellow
Write-Host "   mongod" -ForegroundColor White

Write-Host "`n2️⃣  TERMINAL 2 - Backend Server:" -ForegroundColor Yellow
Write-Host "   cd backend`n   npm run dev" -ForegroundColor White

Write-Host "`n3️⃣  TERMINAL 3 - Frontend Server:" -ForegroundColor Yellow
Write-Host "   cd frontend`n   npm run dev" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  WHEN EVERYTHING IS RUNNING:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n🌐 Open in your browser:" -ForegroundColor Cyan
Write-Host "   http://localhost:5173" -ForegroundColor Green

Write-Host "`n🔌 Backend API:" -ForegroundColor Cyan
Write-Host "   http://localhost:5000/api" -ForegroundColor Green

Write-Host "`n✅ Expected output:" -ForegroundColor Cyan
Write-Host "   - MongoDB: 'Listening on 27017'" -ForegroundColor Green
Write-Host "   - Backend: 'Server running in development mode'" -ForegroundColor Green
Write-Host "   - Frontend: 'Local: http://localhost:5173'" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  TROUBLESHOOTING" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`n❓ MongoDB won't start?" -ForegroundColor Yellow
Write-Host "   - Make sure MongoDB is installed" -ForegroundColor White
Write-Host "   - Check if port 27017 is free: netstat -ano | findstr :27017" -ForegroundColor White
Write-Host "   - Restart MongoDB service" -ForegroundColor White

Write-Host "`n❓ 'Failed to fetch' error?" -ForegroundColor Yellow
Write-Host "   - Ensure backend is running on port 5000" -ForegroundColor White
Write-Host "   - Check .env files have correct API_URL" -ForegroundColor White
Write-Host "   - Backend: PORT=5000" -ForegroundColor White
Write-Host "   - Frontend: VITE_API_URL=http://localhost:5000/api" -ForegroundColor White

Write-Host "`n❓ Port already in use?" -ForegroundColor Yellow
Write-Host "   - MongoDB (27017): lsof -i :27017" -ForegroundColor White
Write-Host "   - Backend (5000): lsof -i :5000" -ForegroundColor White
Write-Host "   - Frontend (5173): lsof -i :5173" -ForegroundColor White
Write-Host "   - Kill process: taskkill /PID [PID] /F" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  START YOUR SERVERS NOW! 🚀" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
