#!/usr/bin/env python3
"""
Quick beads CLI wrapper - bypass br sync issues.

Usage:
    python scripts/bd-quick.py ready
    python scripts/bd-quick.py list
    python scripts/bd-quick.py show <id>
    python scripts/bd-quick.py stats
"""
import sqlite3
import sys
from pathlib import Path

def get_db():
    """Get database connection."""
    db_path = Path(__file__).parent.parent / '.beads' / 'beads.db'
    return sqlite3.connect(str(db_path))

def cmd_ready():
    """Show ready work."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, title, priority, issue_type
        FROM issues
        WHERE status = 'open'
        ORDER BY priority, created_at
        LIMIT 20
    """)

    print("Ready work (top 20):")
    for i, (id, title, priority, type) in enumerate(cursor.fetchall(), 1):
        print(f"{i:2d}. [{type}] {id}: {title}")

    conn.close()

def cmd_list():
    """List all issues."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, title, status, priority
        FROM issues
        ORDER BY status, priority, created_at
    """)

    for id, title, status, priority in cursor.fetchall():
        symbol = "○" if status == "open" else "●"
        print(f"{symbol} {id}: {title} [{status}]")

    conn.close()

def cmd_show(id):
    """Show issue details."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM issues WHERE id = ?", (id,))
    row = cursor.fetchone()

    if not row:
        print(f"Issue {id} not found")
        conn.close()
        return

    columns = [desc[0] for desc in cursor.description]
    issue = dict(zip(columns, row))

    print(f"\n{issue['id']} · {issue['title']}")
    print(f"Status: {issue['status']}")
    print(f"Priority: {issue.get('priority', 'N/A')}")
    print(f"Type: {issue.get('issue_type', 'N/A')}")
    print(f"Labels: {issue.get('labels', 'N/A')}")
    print(f"\n{issue.get('description', 'No description')}")

    conn.close()

def cmd_stats():
    """Show statistics."""
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM issues")
    total = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM issues WHERE status = 'open'")
    open_count = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM issues WHERE status = 'closed'")
    closed = cursor.fetchone()[0]

    print(f"Total: {total}")
    print(f"Open: {open_count}")
    print(f"Closed: {closed}")
    print(f"Ready to work: {open_count}")

    conn.close()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python bd-quick.py <command> [args]")
        print("Commands: ready, list, show <id>, stats")
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == 'ready':
        cmd_ready()
    elif cmd == 'list':
        cmd_list()
    elif cmd == 'show' and len(sys.argv) > 2:
        cmd_show(sys.argv[2])
    elif cmd == 'stats':
        cmd_stats()
    else:
        print(f"Unknown command: {cmd}")
        sys.exit(1)
