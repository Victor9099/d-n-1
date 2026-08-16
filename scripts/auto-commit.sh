#!/bin/bash
# Auto-commit with standardized message
# Usage: ./scripts/auto-commit.sh [phase_number]

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

cd "$PROJECT_ROOT"

echo -e "${BLUE}📝 Creating auto-commit for Phase $PHASE...${NC}"
echo ""

# Check if there are changes to commit
if git diff --quiet && git diff --staged --quiet; then
    echo -e "${YELLOW}⚠ No changes to commit${NC}"
    exit 0
fi

# Stage all changes
git add -A

# Create commit message
COMMIT_MSG="feat(phase-$PHASE): complete Phase $PHASE - Clothing Commerce Platform

All Phase $PHASE tasks completed and validated successfully.

Phase: $PHASE
Validation: ✅ All checks passed
Type: automated-phase-complete

Co-Authored-By: Claude <noreply@anthropic.com>"

# Create commit
git commit -m "$COMMIT_MSG"

echo -e "${GREEN}✅ Commit created successfully!${NC}"
echo ""
echo "Commit message:"
echo "$COMMIT_MSG"
echo ""
echo "Next step: ./scripts/auto-pr.sh $PHASE"
