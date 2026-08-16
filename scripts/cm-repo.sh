#!/bin/bash
# cm-repo - Add lessons to REPO scope (project-specific), not global
# Usage: ./scripts/cm-repo.sh add "Lesson content"
#        ./scripts/cm-repo.sh list
#        ./scripts/cm-repo.sh search "keyword"

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PLAYBOOK="$PROJECT_ROOT/.cass/playbook.yaml"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check playbook exists
if [ ! -f "$PLAYBOOK" ]; then
    echo -e "${RED}Error: Repo playbook not found at $PLAYBOOK${NC}"
    echo "Run: cm init"
    exit 1
fi

cmd_add() {
    local content="$1"
    local category="${2:-general}"

    if [ -z "$content" ]; then
        echo "Usage: cm-repo.sh add \"Lesson content\" [category]"
        exit 1
    fi

    cd "$PROJECT_ROOT"

    # Use Python to properly update YAML
    python3 << PYTHON_SCRIPT
import yaml
import sys
from datetime import datetime
import secrets

try:
    # Read existing playbook
    with open('.cass/playbook.yaml', 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    if data is None:
        data = {}

    # Initialize bullets if not present
    if 'bullets' not in data:
        data['bullets'] = []

    # Generate unique ID
    timestamp = datetime.utcnow()
    bullet_id = f"repo-{int(timestamp.timestamp())}-{secrets.token_hex(4)}"

    # Create new bullet
    new_bullet = {
        'id': bullet_id,
        'scope': 'repo',
        'category': '$category',
        'content': '''$content''',
        'source': 'manual',
        'type': 'rule',
        'isNegative': False,
        'kind': 'workflow_rule',
        'state': 'active',
        'maturity': 'candidate',
        'createdAt': timestamp.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'updatedAt': timestamp.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'pinned': False,
        'deprecated': False
    }

    # Add to bullets
    data['bullets'].append(new_bullet)

    # Write back
    with open('.cass/playbook.yaml', 'w', encoding='utf-8') as f:
        yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

    print(f"[OK] Added to repo playbook: {bullet_id}")
    print(f"  Content: $content")
    print(f"  Category: $category")

except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
PYTHON_SCRIPT
}

cmd_list() {
    cd "$PROJECT_ROOT"

    python3 << 'PYTHON_SCRIPT'
import yaml
import sys

try:
    with open('.cass/playbook.yaml', 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    bullets = data.get('bullets', [])
    if not bullets:
        print("No lessons in repo playbook")
        sys.exit(0)

    print("Repo Playbook Lessons:")
    print("")

    count = 0
    for b in bullets:
        if b.get('deprecated'):
            continue
        count += 1
        print(f"[{count}] {b.get('id', 'N/A')}")
        print(f"    Category: {b.get('category', 'general')}")
        content = b.get('content', 'N/A')
        print(f"    Content: {content[:100]}{'...' if len(content) > 100 else ''}")
        print()

    if count == 0:
        print("No active lessons found")
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
PYTHON_SCRIPT
}

cmd_search() {
    local keyword="$1"

    if [ -z "$keyword" ]; then
        echo "Usage: cm-repo.sh search \"keyword\""
        exit 1
    fi

    cd "$PROJECT_ROOT"

    python3 << PYTHON_SCRIPT
import yaml
import sys

try:
    with open('.cass/playbook.yaml', 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f)

    bullets = data.get('bullets', [])
    keyword = '''$keyword'''.lower()

    found = 0
    for b in bullets:
        if b.get('deprecated'):
            continue
        content = b.get('content', '').lower()
        if keyword in content:
            found += 1
            print(f"[{found}] {b.get('id', 'N/A')}")
            print(f"    Category: {b.get('category', 'general')}")
            print(f"    Content: {b.get('content', 'N/A')}")
            print()

    if found == 0:
        print("No matches found")
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
    sys.exit(1)
PYTHON_SCRIPT
}

# Main
case "${1:-}" in
    add)
        shift
        cmd_add "$@"
        ;;
    list|ls)
        cmd_list
        ;;
    search)
        shift
        cmd_search "$@"
        ;;
    *)
        echo "Usage: cm-repo.sh <command>"
        echo ""
        echo "Commands:"
        echo "  add \"content\" [category]  - Add lesson to repo scope"
        echo "  list                       - List all repo lessons"
        echo "  search \"keyword\"           - Search lessons"
        echo ""
        echo "Examples:"
        echo "  ./scripts/cm-repo.sh add \"OpenAPI validation is required before codegen\""
        echo "  ./scripts/cm-repo.sh add \"Use cursor pagination\" architecture"
        echo "  ./scripts/cm-repo.sh list"
        echo "  ./scripts/cm-repo.sh search \"pagination\""
        ;;
esac
