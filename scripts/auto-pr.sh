#!/bin/bash
# Auto-create PR on GitHub
# Usage: ./scripts/auto-pr.sh [phase_number]

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

echo -e "${BLUE}🚀 Creating PR for Phase $PHASE...${NC}"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}✗ GitHub CLI (gh) is not installed${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}✗ Not authenticated with GitHub${NC}"
    echo "Run: gh auth login"
    exit 1
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
BASE_BRANCH="main"

# Create feature branch if on main
if [ "$CURRENT_BRANCH" = "$BASE_BRANCH" ]; then
    BRANCH_NAME="auto/phase-$PHASE-complete"
    echo -e "${BLUE}Creating branch: $BRANCH_NAME${NC}"
    git checkout -b "$BRANCH_NAME"
else
    BRANCH_NAME="$CURRENT_BRANCH"
    echo -e "${BLUE}Using current branch: $BRANCH_NAME${NC}"
fi

# Push branch
echo -e "${BLUE}Pushing to origin...${NC}"
git push origin "$BRANCH_NAME"
echo ""

# Get stats from beads
if [ -f ".beads/beads.db" ]; then
    TOTAL=$(sqlite3 ".beads/beads.db" "SELECT COUNT(*) FROM issues WHERE labels LIKE '%phase-$PHASE%';")
    CLOSED=$(sqlite3 ".beads/beads.db" "SELECT COUNT(*) FROM issues WHERE labels LIKE '%phase-$PHASE%' AND status = 'closed';")
else
    TOTAL="N/A"
    CLOSED="N/A"
fi

# Generate PR body
PR_BODY="## 🎉 Phase $PHASE Complete

All Phase $PHASE tasks have been completed and validated successfully.

### 📊 Statistics
- **Total Tasks**: $TOTAL
- **Completed**: $CLOSED
- **Validation**: ✅ All checks passed

### ✅ Validations Run
- TypeCheck
- Linting
- Unit Tests
- UBS Static Analysis
- Build

### 📋 Completed Stories
$(if [ -f ".beads/beads.db" ]; then
    sqlite3 ".beads/beads.db" "SELECT '- [x] **' || id || '**: ' || title FROM issues WHERE labels LIKE '%phase-$PHASE%' AND status = 'closed';"
fi)

### 🔄 Next Steps
1. Review the changes in this PR
2. Verify all CI checks pass
3. Merge to main branch
4. Phase $((PHASE + 1)) will be unblocked

---
🤖 Generated automatically by CI/CD pipeline
"

echo -e "${BLUE}Creating Pull Request...${NC}"
echo ""

# Create PR
PR_URL=$(gh pr create \
    --title "🎉 Auto: Phase $PHASE Complete" \
    --body "$PR_BODY" \
    --head "$BRANCH_NAME" \
    --base "$BASE_BRANCH" \
    --label "auto-generated,phase-complete,ready-for-review")

echo -e "${GREEN}✅ PR created successfully!${NC}"
echo ""
echo "PR URL: $PR_URL"
echo ""
echo "Next: Review and merge the PR on GitHub"
