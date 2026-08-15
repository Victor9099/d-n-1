#!/usr/bin/env python3
"""
Export beads SQLite database to JSONL for Claude Code plugin.

Usage:
    python scripts/export-beads-to-jsonl.py

This script reads from .beads/beads.db and writes to .beads/issues.jsonl
"""
import sqlite3
import json
from datetime import datetime
from pathlib import Path

def export_beads_to_jsonl():
    """Export SQLite database to JSONL format."""
    beads_dir = Path(__file__).parent.parent / '.beads'
    db_path = beads_dir / 'beads.db'
    jsonl_path = beads_dir / 'issues.jsonl'

    if not db_path.exists():
        print(f"Error: Database not found at {db_path}")
        return False

    # Connect to SQLite database
    conn = sqlite3.connect(str(db_path))
    cursor = conn.cursor()

    # Get all issues
    cursor.execute('SELECT * FROM issues ORDER BY created_at')
    columns = [desc[0] for desc in cursor.description]

    issues = []
    for row in cursor.fetchall():
        issue = dict(zip(columns, row))

        # Convert to JSONL format
        jsonl_issue = {
            '_type': 'issue',
            'id': issue.get('id'),
            'title': issue.get('title'),
            'description': issue.get('description', ''),
            'status': issue.get('status', 'open'),
            'priority': issue.get('priority', 2),
            'issue_type': issue.get('type', 'task'),
            'labels': issue.get('labels', ''),
            'created_at': issue.get('created_at', datetime.now().isoformat()),
            'updated_at': issue.get('updated_at', datetime.now().isoformat()),
            'dependency_count': 0,
            'dependent_count': 0,
            'comment_count': 0
        }
        issues.append(jsonl_issue)

    conn.close()

    # Write to JSONL
    with open(jsonl_path, 'w', encoding='utf-8') as f:
        for issue in issues:
            f.write(json.dumps(issue, ensure_ascii=False) + '\n')

    # Count by status
    open_count = sum(1 for i in issues if i.get('status') == 'open')
    closed_count = sum(1 for i in issues if i.get('status') == 'closed')

    print(f"[OK] Exported {len(issues)} issues to {jsonl_path}")
    print(f"  Open: {open_count}, Closed: {closed_count}")
    return True

if __name__ == '__main__':
    export_beads_to_jsonl()
