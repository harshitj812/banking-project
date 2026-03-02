# Temporary helper script to add Node.js (and optionally Maven) installation folders to PATH
# Usage: run this before invoking frontend or backend commands if npm or mvn are not recognized.

function Add-ToPath($dir) {
    if (Test-Path $dir) {
        $env:PATH = "$dir;$env:PATH"
        Write-Host "Added $dir to PATH for this session." -ForegroundColor Green
        return $true
    }
    return $false
}

$added = $false
# ensure npm is available
if (Get-Command npm -ErrorAction SilentlyContinue) {
    Write-Host "npm is already available on PATH." -ForegroundColor Green
} else {
    $defaultNode = "C:\Program Files\nodejs"
    if (Add-ToPath $defaultNode) {
        Write-Host "You can now run 'npm install' or 'npm start' in the frontend folder." -ForegroundColor Green
        $added = $true
    } else {
        Write-Warning "Node.js not found at $defaultNode. Please install Node.js or adjust the script path."
    }
}

# optionally add maven
if (Get-Command mvn -ErrorAction SilentlyContinue) {
    Write-Host "mvn is already available on PATH." -ForegroundColor Green
} else {
    $defaultMvn = "C:\Program Files\Apache\maven\bin"
    if (Add-ToPath $defaultMvn) {
        Write-Host "Maven CLI (mvn) added to PATH for this session." -ForegroundColor Green
        $added = $true
    }
}

if (-not $added) {
    Write-Host "No changes made to PATH." -ForegroundColor Yellow
}