<#
PowerShell helper to start an individual backend service by name.
Usage: .\run-service.ps1 customer-service
This will change directory into the named folder (quoting the path) and invoke
`mvn spring-boot:run` so you don't have to worry about spaces in the project path.
#>
param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('customer-service','transaction-service','security-service','support-service')]
    [string]$service
)

$root = (Get-Location).ProviderPath
$servicePath = Join-Path $root $service
if (-not (Test-Path $servicePath)) {
    Write-Error "Service folder '$service' not found under $root"
    exit 1
}

Write-Host "Starting $service from $servicePath" -ForegroundColor Cyan
Push-Location $servicePath
try {
    mvn spring-boot:run
} finally {
    Pop-Location
}
