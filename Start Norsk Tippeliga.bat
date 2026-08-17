@echo off
rem Starter Norsk Tippeliga-serveren (hvis den ikke kjorer) og apner spillet i nettleseren.
netstat -ano | findstr /R /C:":5176 .*LISTENING" >nul
if errorlevel 1 (
  start "Norsk Tippeliga server" /min cmd /c "cd /d %~dp0 && node server.js"
  timeout /t 2 /nobreak >nul
)
start "" http://localhost:5176
