# Campus Ratings Development Server Startup Script (Stable)
# Runs the Node watchdog that auto-restarts the dev server.

param(
    [switch]$Help
)

if ($Help) {
    Write-Host "Campus Ratings Dev Server Startup" -ForegroundColor Green
    Write-Host ""
    Write-Host "Usage: .\start-dev.ps1" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "This script starts the development server with auto-restart capability."
    exit 0
}

Write-Host "Starting Campus Ratings (stable dev server)..." -ForegroundColor Green
Write-Host "URL: http://127.0.0.1:5000" -ForegroundColor Cyan
Write-Host "Keep this terminal open (Ctrl+C to stop)." -ForegroundColor Cyan
Write-Host ""

# Run development server with watchdog
npm run dev:stable
