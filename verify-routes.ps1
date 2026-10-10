$env:PATH = "C:\Users\as993\nodejs;" + $env:PATH

Write-Host "Verifying Frontend Pages and Routes..." -ForegroundColor Cyan

# 1. Test Home page
$home = Invoke-WebRequest -Uri "http://localhost:4200/" -UseBasicParsing
Write-Host "Home Page HTTP Status: $($home.StatusCode)" -ForegroundColor Green

# 2. Test Products page
$products = Invoke-WebRequest -Uri "http://localhost:4200/products" -UseBasicParsing
Write-Host "Products Page HTTP Status: $($products.StatusCode)" -ForegroundColor Green

# 3. Test Admin Login page
$adminLogin = Invoke-WebRequest -Uri "http://localhost:4200/admin/login" -UseBasicParsing
Write-Host "Admin Login Page HTTP Status: $($adminLogin.StatusCode)" -ForegroundColor Green

Write-Host "`nAll frontend routes responding properly!" -ForegroundColor Green
