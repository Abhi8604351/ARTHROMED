$env:PATH = "C:\Users\as993\nodejs;" + $env:PATH
Set-Location "c:\Users\as993\Downloads\Arthromed\ARTHROMED\frontend"
Write-Host "Starting ArthroMed Angular Frontend on Port 4200..."
& "C:\Users\as993\nodejs\npx.cmd" ng serve --port 4200 --host 0.0.0.0
