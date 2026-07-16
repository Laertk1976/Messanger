@echo off
setlocal
set "NODE_DIR=C:\Program Files\nodejs"
set "PATH=%NODE_DIR%;%PATH%"
set "PROJECT_NAME=%~1"
if "%PROJECT_NAME%"=="" set "PROJECT_NAME=MessengerApp"
cd /d "%~dp0"
"%NODE_DIR%\node.exe" "%USERPROFILE%\AppData\Roaming\npm\node_modules\@react-native-community\cli\build\bin.js" init %PROJECT_NAME% --version 0.76.0
