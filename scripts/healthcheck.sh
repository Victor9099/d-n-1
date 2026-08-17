#!/bin/sh
# ============================================================================
# Health check endpoint for Docker health checks
# ============================================================================
# Usage: ./scripts/healthcheck.sh <url> [timeout]
# Returns 0 if healthy, 1 if not
# ============================================================================

URL="${1:-http://localhost:3001/health}"
TIMEOUT="${2:-5}"

RESPONSE=$(wget --spider -q --timeout="$TIMEOUT" --tries=1 "$URL" 2>&1)
STATUS=$?

if [ $STATUS -eq 0 ]; then
  exit 0
else
  echo "Health check failed: $URL (exit code: $STATUS)"
  exit 1
fi
