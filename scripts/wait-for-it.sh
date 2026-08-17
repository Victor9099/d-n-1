#!/bin/sh
# ============================================================================
# Health check & dependency waiting script
# ============================================================================
# Usage:
#   ./scripts/wait-for-it.sh localhost:5432 -- echo "Database is ready"
#   ./scripts/wait-for-it.sh localhost:5432 --timeout=30
# ============================================================================

set -e

TIMEOUT=60
QUIET=0
HOST=""
PORT=""
CMD=""

usage() {
  echo "Usage: $0 host:port [--timeout=N] [--quiet] [-- command]"
  exit 1
}

# Parse args
while [ $# -gt 0 ]; do
  case "$1" in
    *:*)
      HOST=$(echo "$1" | cut -d: -f1)
      PORT=$(echo "$1" | cut -d: -f2)
      shift
      ;;
    --timeout=*)
      TIMEOUT="${1#*=}"
      shift
      ;;
    --quiet)
      QUIET=1
      shift
      ;;
    --)
      shift
      CMD="$@"
      break
      ;;
    *)
      usage
      ;;
  esac
done

if [ -z "$HOST" ] || [ -z "$PORT" ]; then
  usage
fi

log() {
  if [ "$QUIET" -eq 0 ]; then
    echo "⏳ $1"
  fi
}

log "Waiting $TIMEOUT seconds for $HOST:$PORT..."

START_TIME=$(date +%s)

while true; do
  # Try TCP connection
  if nc -z "$HOST" "$PORT" 2>/dev/null; then
    log "✅ $HOST:$PORT is available after $(($(date +%s) - START_TIME))s"
    if [ -n "$CMD" ]; then
      exec $CMD
    fi
    exit 0
  fi

  # Check timeout
  ELAPSED=$(($(date +%s) - START_TIME))
  if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
    echo "❌ Timeout after ${TIMEOUT}s waiting for $HOST:$PORT"
    exit 1
  fi

  sleep 1
done
