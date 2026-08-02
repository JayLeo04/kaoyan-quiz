#!/usr/bin/env python3
"""Audit directly rewritten Markdown pages and their Python-rendered figures."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlsplit


SOURCE_RE = re.compile(r"^\s*<!--\s*luna:source\b.*?-->\s*$", re.MULTILINE)
REVIEW_RE = re.compile(r"<!--\s*luna:review\b.*?-->", re.IGNORECASE | re.DOTALL)
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*#*\s*$", re.MULTILINE)
FENCE_RE = re.compile(r"^\s*(`{3,}|~{3,})")
SUSPICIOUS = ("�", "锟", "鈥")


def relative_target(markdown_path: Path, raw_target: str) -> Path | None:
    target = raw_target.strip().split()[0].strip("<>")
    parsed = urlsplit(target)
    if parsed.scheme or parsed.netloc or target.startswith(("/", "\\", "data:")):
        return None
    return (markdown_path.parent / parsed.path).resolve()


def audit_file(path: Path, root: Path, allow_review: bool) -> list[dict[str, str]]:
    text = path.read_text(encoding="utf-8")
    issues: list[dict[str, str]] = []

    def issue(kind: str, detail: str) -> None:
        issues.append({"file": path.relative_to(root).as_posix(), "kind": kind, "detail": detail})

    if not SOURCE_RE.search(text[:1200]):
        issue("missing-source", "no luna:source comment near the beginning")
    # Chapter indexes conventionally use an H1.  Per-question source slices
    # (question-*.md / answer-*.md) intentionally retain the original H3/H4
    # heading so their source backlink is self-contained; requiring H1 there
    # would create a false failure and tempt agents to rewrite the source title.
    is_source_slice = path.name.startswith(("question-", "answer-"))
    if not re.search(r"^#\s+\S", text, re.MULTILINE) and not (is_source_slice and HEADING_RE.search(text)):
        issue("missing-title", "page has no heading suitable for a source page")
    if not allow_review and REVIEW_RE.search(text):
        issue("review-marker", "unresolved luna:review marker remains")
    for marker in SUSPICIOUS:
        if marker in text:
            issue("encoding-residue", f"suspicious encoding residue: {marker}")

    last_level = 0
    headings: set[str] = set()
    for match in HEADING_RE.finditer(text):
        level = len(match.group(1))
        title = re.sub(r"[`*_]", "", match.group(2)).strip()
        if last_level and level > last_level + 1:
            issue("heading-skip", f"heading jumps from H{last_level} to H{level}: {title}")
        if title in headings:
            issue("duplicate-heading", f"duplicate heading: {title}")
        headings.add(title)
        last_level = level

    fence_open = False
    fence_char = ""
    fence_length = 0
    for line in text.splitlines():
        match = FENCE_RE.match(line)
        if not match:
            continue
        token = match.group(1)
        char, length = token[0], len(token)
        if not fence_open:
            fence_open, fence_char, fence_length = True, char, length
        elif char == fence_char and length >= fence_length:
            fence_open = False
    if fence_open:
        issue("unclosed-fence", "code fence is not closed")

    for match in IMAGE_RE.finditer(text):
        alt, raw_target = match.groups()
        if not alt.strip():
            issue("empty-alt", f"image has empty alt: {raw_target}")
        target = relative_target(path, raw_target)
        if target is None:
            issue("nonlocal-image", f"image must be a local Python redraw: {raw_target}")
            continue
        try:
            relative = target.relative_to(root).as_posix()
        except ValueError:
            issue("image-escape", f"image resolves outside output root: {raw_target}")
            continue
        # Assets may live at the book root or beside a chapter/answer slice;
        # both are canonical `assets/py` locations as long as the path stays
        # inside the audited root.
        if not (relative.startswith("assets/py/") or "/assets/py/" in relative):
            issue("not-python-redraw", f"image is outside assets/py/: {relative}")
        if not target.is_file():
            issue("missing-image", f"image file does not exist: {relative}")

    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--allow-review-markers", action="store_true")
    args = parser.parse_args()
    root = args.root.resolve()
    if not root.is_dir():
        parser.error(f"output root not found: {root}")

    pages = sorted(root.rglob("*.md"))
    issues = [issue for page in pages for issue in audit_file(page, root, args.allow_review_markers)]
    for issue in issues:
        print(f"{issue['file']}: {issue['kind']}: {issue['detail']}")
    result = {"version": 1, "root": str(root), "pages": len(pages), "issues": issues, "ok": not issues}
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if not issues:
        print(f"LUNA Markdown audit passed: {len(pages)} pages")
        return 0
    print(f"LUNA Markdown audit failed: {len(issues)} issue(s)", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
