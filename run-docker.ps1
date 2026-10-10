Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ArthroMed Healthcare Platform - Docker Runner         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$dockerCmd = Get-Command docker -ErrorAction SilentlyContinue

if (-not $dockerCmd) {
    Write-Host "[!] Docker CLI was not found on your Windows PATH." -ForegroundColor Yellow
    Write-Host "To install Docker Desktop on Windows:" -ForegroundColor Cyan
    Write-Host "1. Download Docker Desktop for Windows: https://www.docker.com/products/docker-desktop/"
    Write-Host "2. Run the installer and ensure 'Use WSL 2 instead of Hyper-V' is checked."
    Write-Host "3. Start Docker Desktop from the Start Menu."
    Write-Host "`nOnce Docker is running, re-run this script or execute:" -ForegroundColor Green
    Write-Host "docker compose up --build" -ForegroundColor White
    exit 1
}

Write-Host "Building and launching ArthroMed full-stack containers with Docker Compose..." -ForegroundColor Green
docker compose up --build
