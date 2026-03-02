# Helper script to add Apache Maven executable to the PATH for the current session
# Run this from the project root or any location before invoking `mvn`.

# If mvn is already available, nothing to do.
if (Get-Command mvn -ErrorAction SilentlyContinue) {
    Write-Host "mvn is already available on PATH." -ForegroundColor Green
    exit 0
}

# common installation directories to try
$paths = @(
    "C:\Program Files\Apache\maven\bin",
    "C:\Program Files\Maven\bin",
    "C:\Program Files (x86)\Apache\maven\bin"
)

foreach ($p in $paths) {
    if (Test-Path $p) {
        $env:PATH = "$p;$env:PATH"
        Write-Host "Added Maven bin directory ($p) to PATH for this session." -ForegroundColor Green
        exit 0
    }
}

# fallback: search under Program Files for mvn.cmd/mvn.exe
try {
    $found = Get-ChildItem -Path "C:\Program Files" -Include mvn.cmd,mvn.exe -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $dir = Split-Path $found.FullName
        $env:PATH = "$dir;$env:PATH"
        Write-Host "Found Maven executable in $dir and added to PATH." -ForegroundColor Green
        exit 0
    }
} catch {
    # ignore errors
}

Write-Warning "Apache Maven executable not located; please install Maven or set the PATH manually."
Write-Host "Download: https://maven.apache.org/download.cgi" -ForegroundColor Yellow
