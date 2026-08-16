#!/bin/bash
# Run validation suite for phase completion
# Usage: ./scripts/run-validation.sh [phase_number]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

PHASE=${1:-0}

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Running validation suite for Phase $PHASE...${NC}"
echo ""

ERRORS=0

# 1. Type check
echo -e "${BLUE}[1/5] Type checking...${NC}"
if bun run typecheck 2>&1; then
    echo -e "${GREEN}  ✓ Typecheck passed${NC}"
else
    echo -e "${RED}  ✗ Typecheck failed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 2. Linting
echo -e "${BLUE}[2/5] Linting...${NC}"
if bun run lint 2>&1; then
    echo -e "${GREEN}  ✓ Linting passed${NC}"
else
    echo -e "${RED}  ✗ Linting failed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 3. Tests
echo -e "${BLUE}[3/5] Running tests...${NC}"
if bun run test 2>&1; then
    echo -e "${GREEN}  ✓ Tests passed${NC}"
else
    echo -e "${RED}  ✗ Tests failed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 4. UBS scan
echo -e "${BLUE}[4/5] Running UBS scan...${NC}"
if command -v ubs &> /dev/null; then
    if ubs . --ci 2>&1; then
        echo -e "${GREEN}  ✓ UBS scan passed${NC}"
    else
        echo -e "${RED}  ✗ UBS scan found issues${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}  ⚠ UBS not installed, skipping${NC}"
fi
echo ""

# 5. Build check
echo -e "${BLUE}[5/5] Building...${NC}"
if bun run build 2>&1; then
    echo -e "${GREEN}  ✓ Build passed${NC}"
else
    echo -e "${RED}  ✗ Build failed${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Summary
if [ "$ERRORS" -eq 0 ]; then
    echo -e "${GREEN}✅ All validations passed for Phase $PHASE!${NC}"
    exit 0
else
    echo -e "${RED}✗ $ERRORS validation(s) failed${NC}"
    exit 1
fi
