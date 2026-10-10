$ErrorActionPreference = 'Stop'
$env:PATH = "C:\Users\as993\nodejs;" + $env:PATH

Set-Location "c:\Users\as993\Downloads\Arthromed\ARTHROMED\backend"
Write-Host "Compiling backend TypeScript..." -ForegroundColor Cyan
& "C:\Users\as993\nodejs\node.exe" "C:\Users\as993\Downloads\Arthromed\ARTHROMED\backend\node_modules\typescript\bin\tsc"

Write-Host "Backend compiled successfully!" -ForegroundColor Green
