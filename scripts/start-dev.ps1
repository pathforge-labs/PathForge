# ============================================================
# PathForge - Development Server Startup Script
# ============================================================
# Usage: .\scripts\start-dev.ps1
# This starts Docker, FastAPI backend, and Next.js frontend.
# ============================================================

$ROOT = Split-Path -Parent $PSScriptRoot

Write-Host ""
Write-Host "  PathForge - Development Server" -ForegroundColor Cyan
Write-Host "  ==============================" -ForegroundColor Cyan
Write-Host ""

# -- Step 0: Kill existing processes on ports 3000 and 8000 --
Write-Host "[0/3] Cleaning up old processes..." -ForegroundColor Yellow
$ports = @(3000, 8000)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $procIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        foreach ($procId in $procIds) {
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
            Write-Host "  Killed process $procId on port $port" -ForegroundColor DarkGray
        }
    }
}
Start-Sleep -Seconds 1
Write-Host "  [OK] Ports 3000 and 8000 are free" -ForegroundColor Green

# -- Step 1: Docker --
Write-Host "[1/3] Starting Docker services..." -ForegroundColor Yellow
docker compose -f "$ROOT\docker\docker-compose.yml" up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "  [X] Docker failed. Is Docker Desktop running?" -ForegroundColor Red
    exit 1
}
Write-Host "  [OK] PostgreSQL (5432) + Redis (6379) running" -ForegroundColor Green

# -- Step 2: FastAPI Backend --
Write-Host "[2/3] Starting FastAPI backend..." -ForegroundColor Yellow
$backendProcess = Start-Process -PassThru -NoNewWindow -FilePath "$ROOT\apps\api\.venv\Scripts\python.exe" -ArgumentList "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000" -WorkingDirectory "$ROOT\apps\api"
Start-Sleep -Seconds 3
Write-Host "  [OK] FastAPI running on http://localhost:8000" -ForegroundColor Green

# -- Step 3: Next.js Frontend --
Write-Host "[3/3] Starting Next.js frontend..." -ForegroundColor Yellow
$frontendProcess = Start-Process -PassThru -NoNewWindow -FilePath "cmd.exe" -ArgumentList "/c", "pnpm --filter web dev" -WorkingDirectory "$ROOT"
Start-Sleep -Seconds 4

Write-Host ""
Write-Host "  All services running!" -ForegroundColor Green
Write-Host "  ----------------------" -ForegroundColor Green
Write-Host "  Frontend:  http://localhost:3000" -ForegroundColor Green
Write-Host "  Backend:   http://localhost:8000" -ForegroundColor Green
Write-Host "  Swagger:   http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""

# Open browser
Start-Process "http://localhost:3000"

Write-Host "Press Enter to stop all services..." -ForegroundColor DarkGray
Read-Host

# Cleanup
Write-Host "Stopping services..." -ForegroundColor Yellow
if ($backendProcess -and -not $backendProcess.HasExited) {
    Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
}
if ($frontendProcess -and -not $frontendProcess.HasExited) {
    Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
}
Write-Host "  [OK] All services stopped." -ForegroundColor Green
