# Campus Ratings Development Server Startup Script (Stable)
# Runs the Node watchdog that auto-restarts the dev server.

Write-Host "Starting Campus Ratings (stable dev server)..." -ForegroundColor Green
Write-Host "URL: http://127.0.0.1:5000" -ForegroundColor Cyan
Write-Host "Keep this terminal open (Ctrl+C to stop)." -ForegroundColor Cyan

# Run development server
npm run dev:stable
