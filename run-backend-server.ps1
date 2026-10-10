$env:PATH = "C:\Users\as993\nodejs;" + $env:PATH
Set-Location "c:\Users\as993\Downloads\Arthromed\ARTHROMED\backend"
Write-Host "Starting ArthroMed Backend Server on Port 3000..."
& "C:\Users\as993\nodejs\node.exe" dist/index.js
