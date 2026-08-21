#!/bin/bash
# ═══════════════════════════════════════════
# LiteLLM Proxy Setup Script for Linux/Mac
# ═══════════════════════════════════════════

echo "========================================"
echo "LiteLLM Proxy Setup"
echo "========================================"
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python3 is not installed"
    echo "Please install Python3 first"
    exit 1
fi

echo "[1/5] Installing LiteLLM..."
pip3 install litellm[proxy]
if [ $? -ne 0 ]; then
    echo "[ERROR] Failed to install LiteLLM"
    exit 1
fi

echo
echo "[2/5] Creating .env file..."
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# Anthropic
ANTHROPIC_API_KEY=your-anthropic-key-here

# OpenAI
OPENAI_API_KEY=your-openai-key-here

# Google
GOOGLE_API_KEY=your-google-key-here

# OpenRouter
OPENROUTER_API_KEY=your-openrouter-key-here

# LiteLLM Proxy
LITELLM_MASTER_KEY=your-proxy-master-key-here

# Database (Optional)
DATABASE_URL=postgresql://user:pass@localhost:5432/litellm

# Redis (Optional, for caching)
REDIS_PASSWORD=your-redis-password
EOF
    echo "Created .env file. Please edit it with your API keys."
else
    echo ".env file already exists. Skipping..."
fi

echo
echo "[3/5] Checking config file..."
if [ ! -f "litellm-config.yaml" ]; then
    echo "[WARNING] litellm-config.yaml not found"
    echo "Please create it or copy from .pi/proxy-configs/litellm-config.yaml"
else
    echo "Config file found: litellm-config.yaml"
fi

echo
echo "[4/5] Loading environment variables..."
export $(grep -v '^#' .env | xargs)

echo
echo "[5/5] Starting LiteLLM Proxy..."
echo
echo "========================================"
echo "LiteLLM Proxy will start on:"
echo "- API: http://localhost:4000"
echo "- Dashboard: http://localhost:4000"
echo "========================================"
echo
echo "Press Ctrl+C to stop the proxy"
echo

litellm --config litellm-config.yaml --port 4000
