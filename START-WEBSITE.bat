@echo off
setlocal
cd /d "%~dp0"
echo Starting your wedding invitation website...
where py >nul 2>nul
if %errorlevel%==0 goto usepy
where python >nul 2>nul
if %errorlevel%==0 goto usepython
echo Python was not found. Opening the page directly instead.
start "" "%~dp0index.html"
echo If the page is blank, install Python from https://www.python.org/downloads/windows/ and run this file again.
pause
exit /b
:usepy
start "" http://localhost:8000
py -m http.server 8000
exit /b
:usepython
start "" http://localhost:8000
python -m http.server 8000
exit /b
