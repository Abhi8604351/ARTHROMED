$ErrorActionPreference = 'Stop'
$env:PATH = "C:\Users\as993\nodejs;" + $env:PATH

Set-Location "c:\Users\as993\Downloads\Arthromed\ARTHROMED\frontend"
Write-Host "Installing frontend Angular dependencies..." -ForegroundColor Cyan
& "C:\Users\as993\nodejs\npm.cmd" install

Write-Host "Verifying Angular build..." -ForegroundColor Cyan
& "C:\Users\as993\nodejs\npm.cmd" run build

Write-Host "Frontend compiled successfully!" -ForegroundColor Green
