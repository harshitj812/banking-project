# PowerShell script to prepare databases and start all services + frontend
# Adjust MySQL username/password as needed

# --- helper section: ensure mvn/npm are on PATH using common default install locations ---
# If the commands are already available we do nothing; otherwise attempt to add typical
# installation directories for a one‑time session so the script can launch services.
function Ensure-CommandOnPath([string]$cmd, [string[]]$defaultDirs) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        return $true
    }
    foreach ($dir in $defaultDirs) {
        if (Test-Path $dir) {
            $env:PATH = "$dir;$env:PATH"
            Write-Host "Added $dir to PATH for this session (found $cmd)." -ForegroundColor Green
            return $true
        }
    }
    return $false
}

# try maven
# include M2_HOME if set
$defaultMvnDirs = @("C:\Program Files\Apache\maven\bin", "C:\Program Files\Maven\bin", "C:\Program Files (x86)\Apache\maven\bin")
if ($env:M2_HOME) { $defaultMvnDirs += Join-Path $env:M2_HOME "bin" }
$mvnsuccess = Ensure-CommandOnPath mvn $defaultMvnDirs
if (-not $mvnsuccess) {
    # attempt a broad filesystem search for mvn.exe/mvn.cmd (may be slow)
    try {
        $found = Get-ChildItem -Path "C:\Program Files" -Include mvn.cmd,mvn.bat,mvn.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) {
            $dir = Split-Path $found.FullName
            $env:PATH = "$dir;$env:PATH"
            Write-Host "Found Maven executable at $dir and added to PATH." -ForegroundColor Green
            $mvnsuccess = $true
        }
    } catch {
        # ignore permission errors
    }
}
if (-not $mvnsuccess) {
    Write-Warning "mvn not found on PATH; please install Maven or adjust PATH. Backend services may not start." 
    Write-Host "You can download Maven from https://maven.apache.org/download.cgi and add its \bin folder to your PATH or set M2_HOME." -ForegroundColor Yellow
}

# try npm (node path helper exists but we'll handle inline as well)
$npmsuccess = Ensure-CommandOnPath npm @("C:\Program Files\nodejs")
if (-not $npmsuccess) {
    Write-Warning "npm not found on PATH; please install Node.js or adjust PATH. Frontend may not start." 
}

$mysqlUser = "root"
$mysqlPass = "yourpassword"

Write-Host "Creating databases if they do not exist..."
# ensure mysql CLI is on PATH. if not, try to locate a standard installation
if (Get-Command mysql -ErrorAction SilentlyContinue) {
    & mysql -u $mysqlUser -p$mysqlPass -e "CREATE DATABASE IF NOT EXISTS banking_customer; CREATE DATABASE IF NOT EXISTS banking_transaction;" 2>$null
} else {
    $mysqlDirs = @("C:\Program Files\MySQL\MySQL Server 8.0\bin", "C:\Program Files\MySQL\MySQL Server 5.7\bin")
    $mysqlFound = $false
    foreach ($d in $mysqlDirs) {
        if (Test-Path (Join-Path $d "mysql.exe")) {
            $env:PATH = "$d;$env:PATH"
            Write-Host "Added MySQL CLI from $d to PATH." -ForegroundColor Green
            $mysqlFound = $true
            break
        }
    }
    if ($mysqlFound) {
        & mysql -u $mysqlUser -p$mysqlPass -e "CREATE DATABASE IF NOT EXISTS banking_customer; CREATE DATABASE IF NOT EXISTS banking_transaction;" 2>$null
    } else {
        Write-Warning "mysql CLI not found on PATH; please install MySQL or add its bin folder to PATH. Databases must be created manually."
        Write-Host "You can download MySQL Community Server from https://dev.mysql.com/downloads/ and ensure the installation's bin directory is in your PATH." -ForegroundColor Yellow
    }
}

# helper to start a process in new window
function Start-ServiceWindow($path, $cmd) {
    Start-Process powershell -ArgumentList @('-NoExit','-Command',"cd `"$path`"; $cmd") -WindowStyle Normal
}

Write-Host "Starting customer-service..."
Start-ServiceWindow "$(Get-Location)\customer-service" "mvn spring-boot:run"

Write-Host "Starting transaction-service..."
Start-ServiceWindow "$(Get-Location)\transaction-service" "mvn spring-boot:run"

Write-Host "Starting security-service..."
Start-ServiceWindow "$(Get-Location)\security-service" "mvn spring-boot:run"

Write-Host "Starting support-service..."
Start-ServiceWindow "$(Get-Location)\support-service" "mvn spring-boot:run"

Write-Host "Starting frontend..."
# verify npm is available
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Start-ServiceWindow "$(Get-Location)\frontend" "npm install; npm start"
} else {
    Write-Warning "npm not found on PATH; please install Node.js (https://nodejs.org/) and restart PowerShell."
    Write-Host "You can still start the frontend manually after installation: cd frontend; npm install; npm start"
}

Write-Host "If any service failed to launch, start it manually or check the PATH for mvn/npm."
Write-Host "All services launched."
