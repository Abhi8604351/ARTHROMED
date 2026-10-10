$ErrorActionPreference = 'Stop'

$nodeDir = "C:\Users\as993\nodejs"
$zipPath = "$nodeDir\node.zip"
$extractDir = "$nodeDir\extracted"
$downloadUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip"

Write-Host "Creating target folder: $nodeDir..." -ForegroundColor Cyan
if (-not (Test-Path $nodeDir)) {
    New-Item -ItemType Directory -Path $nodeDir -Force | Out-Null
}

Write-Host "Downloading Node.js v20.18.0 (LTS 64-bit)..." -ForegroundColor Cyan
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Invoke-WebRequest -Uri $downloadUrl -OutFile $zipPath

Write-Host "Extracting archive..." -ForegroundColor Cyan
Expand-Archive -Path $zipPath -DestinationPath $extractDir -Force

$innerFolder = Get-ChildItem -Path $extractDir | Select-Object -First 1
Get-ChildItem -Path $innerFolder.FullName | Copy-Item -Destination $nodeDir -Recurse -Force

Write-Host "Cleaning up temporary files..." -ForegroundColor Cyan
Remove-Item $extractDir -Recurse -Force
Remove-Item $zipPath -Force

Write-Host "Configuring user PATH..." -ForegroundColor Cyan
$currentPath = [Environment]::GetEnvironmentVariable('PATH', 'User')
if ($currentPath -notlike "*$nodeDir*") {
    $newPath = "$nodeDir;$currentPath"
    [Environment]::SetEnvironmentVariable('PATH', $newPath, 'User')
}
$env:PATH = "$nodeDir;" + $env:PATH

Write-Host "Verification:" -ForegroundColor Green
& "$nodeDir\node.exe" -v
& "$nodeDir\npm.cmd" -v

Write-Host "Node.js successfully installed and ready!" -ForegroundColor Green
