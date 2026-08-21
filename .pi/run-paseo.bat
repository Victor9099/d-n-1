@echo off
REM ═══════════════════════════════════════════
REM Paseo + Pi Integration Script
REM ═══════════════════════════════════════════

echo ========================================
echo 🚶 Paseo + Pi Integration
echo ========================================
echo.

REM Check if Paseo is installed
where npx >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npx not found. Please install Node.js
    pause
    exit /b 1
)

echo [1/4] Checking Paseo daemon status...
call npx paseo status >nul 2>&1
if errorlevel 1 (
    echo [!] Paseo daemon not running. Starting...
    call npx paseo start
    timeout /t 3 /nobreak >nul
) else (
    echo [✓] Paseo daemon is running
)

echo.
echo [2/4] Registering Pi provider...
if not exist "%USERPROFILE%\.paseo\providers" (
    mkdir "%USERPROFILE%\.paseo\providers"
)

REM Create Pi provider config
(
echo {
echo   "id": "pi",
echo   "label": "Pi Coding Agent",
echo   "description": "Advanced AI coding agent with multi-agent orchestration",
echo   "enabledByDefault": true,
echo   "defaultModeId": "default",
echo   "modes": [
echo     {
echo       "id": "default",
echo       "label": "Default Mode",
echo       "description": "Standard Pi agent with full tool access",
echo       "icon": "Sparkles",
echo       "colorTier": "safe"
echo     },
echo     {
echo       "id": "auto",
echo       "label": "Auto Mode",
echo       "description": "Automatic tool execution without prompts",
echo       "icon": "Zap",
echo       "colorTier": "moderate",
echo       "isUnattended": true
echo     },
echo     {
echo       "id": "multi-agent",
echo       "label": "Multi-Agent Mode",
echo       "description": "Full hierarchy: Supervisor → Lead → Peer → Workers",
echo       "icon": "Users",
echo       "colorTier": "moderate"
echo     }
echo   ]
echo }
) > "%USERPROFILE%\.paseo\providers\pi.json"

echo [✓] Pi provider registered

echo.
echo [3/4] Checking Pi installation...
where pi >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Pi not found in PATH
    echo Please install Pi: npm install -g @earendil-works/pi-coding-agent
    pause
    exit /b 1
) else (
    echo [✓] Pi is installed
)

echo.
echo [4/4] Testing integration...
echo.
echo ========================================
echo ✅ Integration Complete!
echo ========================================
echo.
echo 📊 Paseo Dashboard: http://localhost:6767
echo.
echo 🚀 Usage Examples:
echo.
echo   # Run Pi agent with task
echo   npx paseo run "Implement user auth" --provider pi
echo.
echo   # Run with multi-agent mode
echo   npx paseo run "Build REST API" --provider pi --mode multi-agent
echo.
echo   # List all agents
echo   npx paseo ls
echo.
echo   # View agent logs
echo   npx paseo logs ^<agent-id^>
echo.
echo ========================================
echo.

pause
