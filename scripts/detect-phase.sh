#!/bin/bash
# Detect phase completion status
# Usage: ./scripts/detect-phase.sh [phase_number]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Get phase from argument or auto-detect
if [ -n "$1" ]; then
    PHASE="$1"
else
    # Auto-detect current phase
    if [ -f "$PROJECT_ROOT/.beads/beads.db" ]; then
        # Check which phase has the most open issues
        PHASE_0_OPEN=$(sqlite3 "$PROJECT_ROOT/.beads/beads.db" "SELECT COUNT(*) FROM issues WHERE labels LIKE '%phase-0%' AND status = 'open';" 2>/dev/null || echo "0")
        PHASE_1_OPEN=$(sqlite3 "$PROJECT_ROOT/.beads/beads.db" "SELECT COUNT(*) FROM issues WHERE labels LIKE '%phase-1%' AND status = 'open';" 2>/dev/null || echo "0")

        if [ "$PHASE_0_OPEN" -eq 0 ]; then
            PHASE=0
        elif [ "$PHASE_1_OPEN" -eq 0 ]; then
            PHASE=1
        else
            PHASE=0
        fi
    else
        PHASE=0
    fi
fi

echo -e "${BLUE}🔍 Checking Phase $PHASE completion...${NC}"
echo ""

# Check if beads database exists
if [ ! -f "$PROJECT_ROOT/.beads/beads.db" ]; then
    echo -e "${RED}✗ Beads database not found${NC}"
    exit 1
fi

# Count issues by status
TOTAL=$(sqlite3 "$PROJECT_ROOT/.beads/beads.db" "SELECT COUNT(*) FROM issues WHERE labels LIKE '%phase-$PHASE%';")
OPEN=$(sqlite3 "$PROJECT_ROOT/.beads/beads.db" "SELECT COUNT(*) FROM issues WHERE labels LIKE '%phase-$PHASE%' AND status = 'open';")
CLOSED=$(sqlite3 "$PROJECT_ROOT/.beads/beads.db" "SELECT COUNT(*) FROM issues WHERE labels LIKE '%phase-$PHASE%' AND status = 'closed';")

echo -e "${BLUE}Phase $PHASE Statistics:${NC}"
echo "  Total tasks: $TOTAL"
echo -e "  ${GREEN}✓ Completed: $CLOSED${NC}"
echo -e "  ${YELLOW}○ Open: $OPEN${NC}"
echo ""

# Check if phase is complete
if [ "$TOTAL" -eq 0 ]; then
    echo -e "${YELLOW}⚠ No tasks found for Phase $PHASE${NC}"
    exit 1
elif [ "$OPEN" -eq 0 ]; then
    echo -e "${GREEN}🎉 Phase $PHASE is COMPLETE!${NC}"
    echo ""
    echo "All $TOTAL tasks have been closed."
    echo ""
    echo "Next steps:"
    echo "  1. Run validation: ./scripts/run-validation.sh"
    echo "  2. Create PR: ./scripts/auto-pr.sh $PHASE"
    echo "  3. Or run full automation: ./scripts/phase-complete.sh $PHASE"
    exit 0
else
    echo -e "${YELLOW}⏳ Phase $PHASE is NOT complete${NC}"
    echo ""
    echo "Remaining tasks:"
    sqlite3 "$PROJECT_ROOT/.beads/beads.db" "SELECT id, title FROM issues WHERE labels LIKE '%phase-$PHASE%' AND status = 'open' LIMIT 10;" | while IFS='|' read -r id title; do
        echo "  - [$id] $title"
    done
    exit 1
fi
