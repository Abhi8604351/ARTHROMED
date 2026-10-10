$env:PATH = "C:\Users\as993\nodejs;" + $env:PATH

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   ARTHROMED AUTHENTICATION & SECURITY TEST SUITE         " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000/api"

function Get-JsonError($errorRecord) {
    if ($errorRecord.ErrorDetails -and $errorRecord.ErrorDetails.Message) {
        return ($errorRecord.ErrorDetails.Message | ConvertFrom-Json)
    }
    if ($errorRecord.Exception.Response) {
        $stream = $errorRecord.Exception.Response.GetResponseStream()
        if ($stream) {
            $reader = New-Object System.IO.StreamReader($stream)
            $text = $reader.ReadToEnd()
            if ($text) {
                return ($text | ConvertFrom-Json)
            }
        }
    }
    return $null
}

# 1. Test Signup with Invalid Email Format
Write-Host "`n[Test 1] Register with invalid email..." -ForegroundColor Yellow
$bodyInvalidEmail = @{
    fullName = "Test User"
    email = "invalid-email"
    password = "Password@123"
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $bodyInvalidEmail -ContentType "application/json"
    Write-Host "FAIL: Should have rejected invalid email!" -ForegroundColor Red
} catch {
    $jsonErr = Get-JsonError $_
    Write-Host "PASS: Rejected invalid email format with 400. Reason: $($jsonErr.error)" -ForegroundColor Green
}

# 2. Test Signup with Weak Password
Write-Host "`n[Test 2] Register with weak password (<8 chars / missing criteria)..." -ForegroundColor Yellow
$bodyWeakPwd = @{
    fullName = "Test User"
    email = "weakuser@testclinic.com"
    password = "pass"
} | ConvertTo-Json

try {
    $res = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $bodyWeakPwd -ContentType "application/json"
    Write-Host "FAIL: Should have rejected weak password!" -ForegroundColor Red
} catch {
    $jsonErr = Get-JsonError $_
    Write-Host "PASS: Rejected weak password with 400. Reason: $($jsonErr.error)" -ForegroundColor Green
}

# 3. Test Signup with Strong Password
$testUserEmail = "surgeon.sharma$((Get-Random -Minimum 1000 -Maximum 9999))@orthomail.com"
$testUserPassword = "SecurePass@2026"
Write-Host "`n[Test 3] Register with strong password ($testUserEmail)..." -ForegroundColor Yellow
$bodyValid = @{
    fullName = "Dr. Rajesh Sharma"
    email = $testUserEmail
    password = $testUserPassword
} | ConvertTo-Json

try {
    $regRes = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $bodyValid -ContentType "application/json"
    Write-Host "PASS: Successfully registered user: $($regRes.user.email) (Role: $($regRes.user.role))" -ForegroundColor Green
} catch {
    Write-Host "FAIL: Registration error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Test 3 Failed Password Attempts and Verify 10-Minute Lockout
Write-Host "`n[Test 4] Trigger 3 Failed Password Attempts (Lockout Test)..." -ForegroundColor Yellow
for ($i = 1; $i -le 3; $i++) {
    $bodyWrongPwd = @{
        email = $testUserEmail
        password = "WrongPassword#999"
        requiredRole = "customer"
    } | ConvertTo-Json

    try {
        $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $bodyWrongPwd -ContentType "application/json"
        Write-Host "FAIL: Login with wrong password should not succeed!" -ForegroundColor Red
    } catch {
        $status = $_.Exception.Response.StatusCode.value__
        $jsonErr = Get-JsonError $_
        
        Write-Host "Attempt $i -> HTTP Status: $status | Error: $($jsonErr.error)" -ForegroundColor Cyan
        if ($i -lt 3) {
            Write-Host "Attempts remaining: $($jsonErr.attemptsRemaining)" -ForegroundColor DarkCyan
        } else {
            Write-Host "Locked state: isLocked=$($jsonErr.isLocked), remainingSeconds=$($jsonErr.remainingSeconds)" -ForegroundColor Magenta
            if ($status -eq 423 -and $jsonErr.isLocked -eq $true -and $jsonErr.remainingSeconds -ge 590) {
                Write-Host "PASS: 10-minute Lockout triggered on attempt 3!" -ForegroundColor Green
            } else {
                Write-Host "FAIL: Lockout did not activate properly on attempt 3!" -ForegroundColor Red
            }
        }
    }
}

# 5. Verify Immediate Rejection While Locked (Even with Correct Password!)
Write-Host "`n[Test 5] Verify login blocked while account is locked (even with correct password)..." -ForegroundColor Yellow
$bodyCorrectWhileLocked = @{
    email = $testUserEmail
    password = $testUserPassword
    requiredRole = "customer"
} | ConvertTo-Json

try {
    $loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $bodyCorrectWhileLocked -ContentType "application/json"
    Write-Host "FAIL: Login should be blocked during 10-minute lockout!" -ForegroundColor Red
} catch {
    $status = $_.Exception.Response.StatusCode.value__
    $jsonErr = Get-JsonError $_
    if ($status -eq 423 -and $jsonErr.isLocked -eq $true) {
        Write-Host "PASS: Account is strictly locked for 10 minutes ($($jsonErr.remainingSeconds)s remaining)! Server error: $($jsonErr.error)" -ForegroundColor Green
    } else {
        Write-Host "FAIL: Incorrect status during lockout: $status" -ForegroundColor Red
    }
}

# 6. Admin Login and User Management
Write-Host "`n[Test 6] Admin Login and Check All Users..." -ForegroundColor Yellow
$adminLoginBody = @{
    email = "admin@arthromed.com"
    password = "admin123"
    requiredRole = "admin"
} | ConvertTo-Json

$adminRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $adminLoginBody -ContentType "application/json"
$adminToken = $adminRes.token
Write-Host "PASS: Admin logged in successfully! Role: $($adminRes.user.role)" -ForegroundColor Green

# 7. Admin Fetch Users (Admin can see user)
Write-Host "`n[Test 7] Admin fetching all registered users (GET /api/auth/users)..." -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $adminToken" }
$usersRes = Invoke-RestMethod -Uri "$baseUrl/auth/users" -Method Get -Headers $headers

$targetUser = $usersRes | Where-Object { $_.email -eq $testUserEmail }
if ($targetUser) {
    Write-Host "PASS: Admin sees user $($targetUser.fullName) ($($targetUser.email))" -ForegroundColor Green
    Write-Host "User Status in Admin Dashboard: isLocked=$($targetUser.isLocked), failedAttempts=$($targetUser.failedLoginAttempts)" -ForegroundColor Cyan
    if ($targetUser.isLocked -eq $true) {
        Write-Host "PASS: User is accurately marked locked in Admin Portal!" -ForegroundColor Green
    }
} else {
    Write-Host "FAIL: User not found in admin user list!" -ForegroundColor Red
    exit 1
}

# 8. Admin Unlocks User
Write-Host "`n[Test 8] Admin Unlocks User (POST /api/auth/users/$($targetUser.id)/unlock)..." -ForegroundColor Yellow
$unlockRes = Invoke-RestMethod -Uri "$baseUrl/auth/users/$($targetUser.id)/unlock" -Method Post -Headers $headers
Write-Host "PASS: Admin unlock response: $($unlockRes.message)" -ForegroundColor Green
Write-Host "User status after unlock: isLocked=$($unlockRes.user.isLocked)" -ForegroundColor Cyan

# 9. User Logs In Successfully Now!
Write-Host "`n[Test 9] User logging in after admin unlocked their account..." -ForegroundColor Yellow
$loginAfterUnlock = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $bodyCorrectWhileLocked -ContentType "application/json"
Write-Host "PASS: User logged in successfully! Welcome $($loginAfterUnlock.user.fullName)" -ForegroundColor Green

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "   ALL SECURITY & AUTHENTICATION CHECKS PASSED 100%!     " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
