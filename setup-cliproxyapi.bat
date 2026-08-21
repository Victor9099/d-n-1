@echo off
echo.
echo ========================================
echo   CLIProxyAPI Quick Setup
echo ========================================
echo.

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Install from: https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js found

REM Install CLIProxyAPI
echo.
echo [1/3] Installing CLIProxyAPI...
call npm install -g cliproxyapi
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install CLIProxyAPI
    pause
    exit /b 1
)
echo [OK] CLIProxyAPI installed

REM Get API key
echo.
echo [2/3] Enter your AI-Box API key:
set /p API_KEY=

if "%API_KEY:~0,3%" neq "sk-" (
    echo [ERROR] Invalid API key! Must start with sk-
    pause
    exit /b 1
)

REM Set environment variables
echo.
echo [3/3] Setting environment variables...
setx AIBOX_API_KEY "%API_KEY%" >nul
setx OPENAI_API_KEY "%API_KEY%" >nul
setx OPENAI_BASE_URL "http://localhost:8080/v1" >nul
echo [OK] Environment variables set

REM Create config
echo.
echo Creating configuration...
if not exist "%USERPROFILE%\.cliproxyapi" mkdir "%USERPROFILE%\.cliproxyapi"

(
echo providers:
echo   - name: aibox
echo     type: openai-compatible
echo     base_url: https://api.ai-box.vn/v1
echo     api_key: %API_KEY%
echo     models:
echo       - id: deepseek-v4-pro-0813
echo         name: DeepSeek V4 Pro
echo       - id: deepseek-v3
echo         name: DeepSeek V3
echo       - id: grok-4
echo         name: Grok 4
echo.
echo server:
echo   port: 8080
echo   host: localhost
) > "%USERPROFILE%\.cliproxyapi\config.yaml"

echo [OK] Config created

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Config: %USERPROFILE%\.cliproxyapi\config.yaml
echo.
echo Start CLIProxyAPI:
echo   cliproxyapi --config "%USERPROFILE%\.cliproxyapi\config.yaml"
echo.
echo Use Pi:
echo   pi --provider openai --model deepseek-v4-pro-0813
echo.

set /p START_NOW="Start CLIProxyAPI now? (y/n): "
if /i "%START_NOW%"=="y" (
    echo.
    echo Starting CLIProxyAPI...
    echo Press Ctrl+C to stop
    echo.
    cliproxyapi --config "%USERPROFILE%\.cliproxyapi\config.yaml"
)

pause
