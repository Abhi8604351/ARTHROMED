@echo off
title ArthroMed - Push to GitHub
cd /d "c:\Users\as993\Downloads\Arthromed"
echo ========================================================
echo    Pushing ArthroMed to GitHub (Abhi8604351/ARTHROMED)
echo ========================================================
echo.
echo Launching Git push...
echo If a GitHub browser popup appears, click "Sign in with your browser".
echo.
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo [SUCCESS] ArthroMed has been pushed to GitHub!
    echo Repository: https://github.com/Abhi8604351/ARTHROMED
    echo ========================================================
) else (
    echo ========================================================
    echo If GitHub rejected regular password:
    echo GitHub requires a Personal Access Token (PAT) instead of password.
    echo Generate token at: https://github.com/settings/tokens/new
    echo Check "repo" scope, click "Generate token", and paste it as password.
    echo ========================================================
)
echo.
pause
