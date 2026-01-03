@echo off
setlocal

REM Campus Ratings - Stable Dev Start (Windows)
REM Keeps the server running (auto-restart) so refreshing the browser won't hit ERR_CONNECTION_REFUSED.

cd /d "%~dp0"
echo Starting Campus Ratings (background dev server)...
echo URL: http://127.0.0.1:5000
echo.
echo This will keep running even if you close this window.
echo To stop it later: npm run dev:down
echo.

npm run dev:up

echo.
echo Done. You can close this window now.
pause
