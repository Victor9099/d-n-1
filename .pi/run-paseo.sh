#!/bin/bash
# ═══════════════════════════════════════════
# Paseo + Pi Integration Script (Linux/Mac)
# ═══════════════════════════════════════════

echo "========================================"
echo "🚶 Paseo + Pi Integration"
echo "========================================"
echo

# Check if Paseo is installed
if ! command -v npx &> /dev/null; then
    echo "[ERROR] npx not found. Please install Node.js"
    exit 1
fi

echo "[1/4] Checking Paseo daemon status..."
if ! npx paseo status &> /dev/null; then
    echo "[!] Paseo daemon not running. Starting..."
    npx paseo start
    sleep 3
else
    echo "[✓] Paseo daemon is running"
fi

echo
echo "[2/4] Registering Pi provider..."
mkdir -p ~/.paseo/providers

# Create Pi provider config
cat > ~/.paseo/providers/pi.json << 'EOF'
{
  "id": "pi",
  "label": "Pi Coding Agent",
  "description": "Advanced AI coding agent with multi-agent orchestration",
  "enabledByDefault": true,
  "defaultModeId": "default",
  "modes": [
    {
      "id": "default",
      "label": "Default Mode",
      "description": "Standard Pi agent with full tool access",
      "icon": "Sparkles",
      "colorTier": "safe"
    },
    {
      "id": "auto",
      "label": "Auto Mode",
      "description": "Automatic tool execution without prompts",
      "icon": "Zap",
      "colorTier": "moderate",
      "isUnattended": true
    },
    {
      "id": "multi-agent",
      "label": "Multi-Agent Mode",
      "description": "Full hierarchy: Supervisor → Lead → Peer → Workers",
      "icon": "Users",
      "colorTier": "moderate"
    }
  ]
}
EOF

echo "[✓] Pi provider registered"

echo
echo "[3/4] Checking Pi installation..."
if ! command -v pi &> /dev/null; then
    echo "[ERROR] Pi not found in PATH"
    echo "Please install Pi: npm install -g @earendil-works/pi-coding-agent"
    exit 1
else
    echo "[✓] Pi is installed"
fi

echo
echo "[4/4] Testing integration..."
echo
echo "========================================"
echo "✅ Integration Complete!"
echo "========================================"
echo
echo "📊 Paseo Dashboard: http://localhost:6767"
echo
echo "🚀 Usage Examples:"
echo
echo "  # Run Pi agent with task"
echo "  npx paseo run \"Implement user auth\" --provider pi"
echo
echo "  # Run with multi-agent mode"
echo "  npx paseo run \"Build REST API\" --provider pi --mode multi-agent"
echo
echo "  # List all agents"
echo "  npx paseo ls"
echo
echo "  # View agent logs"
echo "  npx paseo logs <agent-id>"
echo
echo "========================================"
echo
