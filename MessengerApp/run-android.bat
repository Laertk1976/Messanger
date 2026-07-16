@echo off
setlocal
set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.11"
set "PATH=%JAVA_HOME%\bin;C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
"C:\Program Files\nodejs\npm.cmd" run android
