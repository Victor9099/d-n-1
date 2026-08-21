@echo off
REM ═══════════════════════════════════════════
REM LiteLLM Proxy Setup Script for Windows
REM ═══════════════════════════════════════════

echo ========================================
echo LiteLLM Proxy Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python from https://www.python.org/
    pause
    exit /b 1
)

echo [1/5] Installing LiteLLM...
pip install litellm[proxy]
if errorlevel 1 (
    echo [ERROR] Failed to install LiteLLM
    pause
    exit /b 1
)

echo.
echo [2/5] Creating .env file...
if not exist ".env" (
    (
        echo # Anthropic
        echo ANTHROPIC_API_KEY=your-anthropic-key-here
        echo.
        echo # OpenAI
        echo OPENAI_API_KEY=your-openai-key-here
        echo.
        echo # Google
        echo GOOGLE_API_KEY=your-google-key-here
        echo.
        echo # OpenRouter
        echo OPENROUTER_API_KEY=your-openrouter-key-here
        echo.
        echo # LiteLLM Proxy
        echo LITELLM_MASTER_KEY=your-proxy-master-key-here
        echo.
        echo # Database (Optional)
        echo DATABASE_URL=postgresql://user:pass@localhost:5432/litellm
        echo.
        echo # Redis (Optional, for caching)
        echo REDIS_PASSWORD=your-redis-password
    ) > .env
    echo Created .env file. Please edit it with your API keys.
) else (
    echo .env file already exists. Skipping...
)

echo.
echo [3/5] Checking config file...
if not exist "litellm-config.yaml" (
    echo [WARNING] litellm-config.yaml not found
    echo Please create it or copy from .pi/proxy-configs/litellm-config.yaml
) else (
    echo Config file found: litellm-config.yaml
)

echo.
echo [4/5] Setting up environment variables...
for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    if "%%B" neq "" (
        set "%%A=%%B"
    )
)

echo.
echo [5/5] Starting LiteLLM Proxy...
echo.
echo ========================================
echo LiteLLM Proxy will start on:
echo - API: http://localhost:4000
echo - Dashboard: http://localhost:4000
echo ========================================
echo.
echo Press Ctrl+C to stop the proxy
echo.

litellm --config litellm-config.yaml --port 4000

pause
