Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "        Starting ArthroMed Full-Stack Platform" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCmd) {
    Write-Host "[ERROR] Node.js was not detected in your PATH." -ForegroundColor Red
    Write-Host "Please download & install Node.js (LTS version) from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "After installation, restart PowerShell and re-run this script." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[1/3] Node.js detected: $(node -v) (npm $(npm -v))" -ForegroundColor Green
Write-Host ""

# Start Backend in new PowerShell window
Write-Host "[2/3] Launching Backend on Port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ARTHROMED\backend'; if (-not (Test-Path 'node_modules')) { Write-Host 'Installing backend dependencies...' -ForegroundColor Cyan; npm install }; Write-Host 'Starting Backend API...' -ForegroundColor Green; npm run dev"

# Start Frontend in new PowerShell window
Write-Host "[3/3] Launching Frontend on Port 4200..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ARTHROMED\frontend'; if (-not (Test-Path 'node_modules')) { Write-Host 'Installing frontend dependencies...' -ForegroundColor Cyan; npm install }; Write-Host 'Starting Angular Frontend...' -ForegroundColor Green; npm start"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Green
Write-Host "🚀 Backend running at:  http://localhost:3000/api/products" -ForegroundColor Green
Write-Host "🚀 Frontend running at: http://localhost:4200" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Green
Write-Host ""
