#!/bin/bash
# Main orchestrator for phase completion automation
# Usage: ./scripts/phase-complete.sh [phase_number] [--skip-validation] [--skip-pr]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Parse arguments
PHASE=${1:-0}
SKIP_VALIDATION=false
SKIP_PR=false

for arg in "$@"; do
    case $arg in
        --skip-validation)
            SKIP_VALIDATION=true
            ;;
        --skip-pr)
            SKIP_PR=true
            ;;
    esac
done

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m'

cd "$PROJECT_ROOT"

echo -e "${MAGENTA}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║   🚀 Phase Completion Automation - Clothing Commerce     ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BLUE}Phase: $PHASE${NC}"
echo -e "${BLUE}Skip validation: $SKIP_VALIDATION${NC}"
echo -e "${BLUE}Skip PR: $SKIP_PR${NC}"
echo ""

# Step 1: Detect phase completion
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}[Step 1/4] Detecting phase completion...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

if ! ./scripts/detect-phase.sh "$PHASE"; then
    echo -e "${RED}Phase $PHASE is not complete. Cannot proceed.${NC}"
    exit 1
fi
echo ""

# Step 2: Run validation
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}[Step 2/4] Running validation suite...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

if [ "$SKIP_VALIDATION" = true ]; then
    echo -e "${YELLOW}⚠ Skipping validation (--skip-validation flag)${NC}"
else
    if ! ./scripts/run-validation.sh "$PHASE"; then
        echo -e "${RED}Validation failed. Cannot proceed.${NC}"
        echo ""
        echo "Fix the issues above and try again, or use --skip-validation to bypass."
        exit 1
    fi
fi
echo ""

# Step 3: Create commit
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}[Step 3/4] Creating commit...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

./scripts/auto-commit.sh "$PHASE"
echo ""

# Step 4: Create PR
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}[Step 4/4] Creating Pull Request...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

if [ "$SKIP_PR" = true ]; then
    echo -e "${YELLOW}⚠ Skipping PR creation (--skip-pr flag)${NC}"
else
    ./scripts/auto-pr.sh "$PHASE"
fi
echo ""

# Update Cass Memory
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}[Bonus] Updating Cass Memory...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"

if command -v cm &> /dev/null; then
    cm playbook add "Phase $PHASE completed via automated CI/CD pipeline" 2>/dev/null || true
    echo -e "${GREEN}  ✓ Cass Memory updated${NC}"
else
    echo -e "${YELLOW}  ⚠ cm not available, skipping${NC}"
fi
echo ""

# Final summary
echo -e "${MAGENTA}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✅ Phase $PHASE Automation Complete!              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${GREEN}Summary:${NC}"
echo "  ✓ Phase completion detected"
if [ "$SKIP_VALIDATION" = false ]; then
    echo "  ✓ Validation passed"
else
    echo "  ⚠ Validation skipped"
fi
echo "  ✓ Commit created"
if [ "$SKIP_PR" = false ]; then
    echo "  ✓ PR created"
fi
echo "  ✓ Memory updated"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Review the PR on GitHub"
echo "  2. Merge when ready"
echo "  3. Phase $((PHASE + 1)) is now unblocked"
echo ""
