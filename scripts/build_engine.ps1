$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$pythonExecutable = Join-Path $projectRoot ".venv\Scripts\python.exe"
if (-not (Test-Path -LiteralPath $pythonExecutable)) {
    throw "Chưa có .venv. Hãy chạy .\scripts\install.ps1 trước."
}

$env:PYTHONNOUSERSITE = "1"
& $pythonExecutable -m pip install -r requirements-build.txt
if ($LASTEXITCODE -ne 0) { throw "Không thể cài dependency build (exit $LASTEXITCODE)." }

& $pythonExecutable -s -m PyInstaller `
    --name creatorutils-engine `
    --onefile `
    --clean `
    --noconfirm `
    --paths $projectRoot `
    --collect-all faster_whisper `
    --collect-all ctranslate2 `
    --collect-all tokenizers `
    --hidden-import cgi `
    --distpath (Join-Path $projectRoot "desktop\engine-dist") `
    --workpath (Join-Path $projectRoot "desktop\engine-build") `
    --specpath (Join-Path $projectRoot "desktop") `
    (Join-Path $projectRoot "engine\sidecar.py")
if ($LASTEXITCODE -ne 0) { throw "PyInstaller build thất bại (exit $LASTEXITCODE)." }

Write-Host "AI engine sidecar: desktop\engine-dist\creatorutils-engine.exe"
