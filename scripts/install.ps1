$ErrorActionPreference = "Stop"

Set-Location (Split-Path -Parent $PSScriptRoot)

if (-not (Test-Path ".venv")) {
    python -m venv .venv
}

$pythonExecutable = Join-Path (Resolve-Path ".venv") "Scripts\python.exe"
& $pythonExecutable -m pip install --upgrade pip
if ($LASTEXITCODE -ne 0) { throw "Không thể nâng cấp pip (exit $LASTEXITCODE)." }
& $pythonExecutable -m pip install -r requirements.txt
if ($LASTEXITCODE -ne 0) { throw "Không thể cài dependency Python (exit $LASTEXITCODE)." }
npm install
if ($LASTEXITCODE -ne 0) { throw "Không thể cài dependency Node.js (exit $LASTEXITCODE)." }

Write-Host "`nCài đặt hoàn tất. Chạy:"
Write-Host ".\.venv\Scripts\Activate.ps1"
Write-Host "npm test"
Write-Host "npm start"
