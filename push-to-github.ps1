param (
    [Parameter(Mandatory=$false)]
    [string]$RepoUrl,

    [Parameter(Mandatory=$false)]
    [string]$Token
)

$gitPath = 'C:\Program Files\Git\cmd\git.exe'
if (-not (Test-Path $gitPath)) {
    $gitPath = 'git'
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ArthroMed Healthcare Platform - GitHub Push Utility   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not $RepoUrl) {
    $RepoUrl = Read-Host "Enter your GitHub Repository URL (e.g., https://github.com/your-username/arthromed.git)"
}

if (-not $RepoUrl) {
    Write-Host "Repository URL is required. Exiting." -ForegroundColor Red
    exit 1
}

# If token provided, format URL with token authentication
$targetUrl = $RepoUrl
if ($Token) {
    # e.g., https://TOKEN@github.com/user/repo.git
    if ($RepoUrl -match "https://github\.com/(.+)") {
        $repoPath = $matches[1]
        $targetUrl = "https://$($Token)@github.com/$repoPath"
    }
}

# Configure remote
& $gitPath remote remove origin 2>$null
& $gitPath remote add origin $targetUrl
& $gitPath branch -M main

Write-Host "Pushing main branch to $RepoUrl..." -ForegroundColor Green
& $gitPath push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nSuccessfully pushed ArthroMed to GitHub!" -ForegroundColor Green
} else {
    Write-Host "`nPush failed. Check your GitHub repository permissions or Personal Access Token (PAT)." -ForegroundColor Yellow
}
