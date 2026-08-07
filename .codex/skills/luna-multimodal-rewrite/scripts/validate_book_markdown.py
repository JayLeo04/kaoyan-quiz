#!/usr/bin/env python3
"""Audit directly rewritten Markdown pages and their Python-rendered figures."""

from __future__ import annotations

import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit


METADATA_RE = re.compile(r"^\s*<!--\s*luna:(source|scope|page)\s+(.+?)-->\s*$", re.MULTILINE)
ATTRIBUTE_RE = re.compile(r"([a-z_]+)=(?:\"([^\"]*)\"|'([^']*)')")
REVIEW_RE = re.compile(r"<!--\s*luna:review\b.*?-->", re.IGNORECASE | re.DOTALL)
FIGURE_PLACEHOLDER_RE = re.compile(r"<!--\s*luna:figure-placeholder\b|图[^\n]{0,40}占位|结构示意图占位", re.IGNORECASE)
IMAGE_RE = re.compile(r"!\[([^\r\n]*?)\]\(([^)\r\n]+)\)")
LINK_RE = re.compile(r"(?<!!)\[[^\]]+\]\(([^)]+)\)")
HEADING_RE = re.compile(r"^(#{1,6})\s+(.+?)\s*#*\s*$", re.MULTILINE)
FENCE_RE = re.compile(r"^\s*(`{3,}|~{3,})")
SUSPICIOUS = ("�", "锟", "鈥")
SKIPPED_DIRECTORIES = {"assets", "audits", "tmp", "work", "__page_review", "review"}


def attributes(raw: str) -> dict[str, str]:
    return {
        match.group(1): match.group(2) if match.group(2) is not None else match.group(3)
        for match in ATTRIBUTE_RE.finditer(raw)
    }


def page_range(raw: str) -> tuple[int, int] | None:
    match = re.fullmatch(r"(\d+)(?:-(\d+))?", raw)
    if not match:
        return None
    start = int(match.group(1))
    end = int(match.group(2) or start)
    return (start, end) if start <= end else None


def relative_target(markdown_path: Path, raw_target: str) -> Path | None:
    target = raw_target.strip().split()[0].strip("<>")
    parsed = urlsplit(target)
    if parsed.scheme or parsed.netloc or target.startswith(("/", "\\", "data:")):
        return None
    return (markdown_path.parent / parsed.path).resolve()


def audit_file(path: Path, root: Path, allow_review: bool, book_page_offset: int | None) -> list[dict[str, str]]:
    text = path.read_text(encoding="utf-8")
    issues: list[dict[str, str]] = []

    def issue(kind: str, detail: str) -> None:
        issues.append({"file": path.relative_to(root).as_posix(), "kind": kind, "detail": detail})

    metadata = [(match.group(1), attributes(match.group(2)), match.start()) for match in METADATA_RE.finditer(text)]
    sources = [item for item in metadata if item[0] == "source"]
    scopes = [item for item in metadata if item[0] == "scope"]
    page_markers = [item for item in metadata if item[0] == "page"]
    if not sources or sources[0][2] >= 1200:
        issue("missing-source", "no luna:source comment near the beginning")
    if len(sources) > 1:
        issue("duplicate-source", f"expected one top-level luna:source comment, found {len(sources)}")
    if len(scopes) > 1:
        issue("duplicate-scope", f"expected at most one luna:scope comment, found {len(scopes)}")

    parsed_ranges: dict[str, tuple[int, int]] = {}
    for kind, attrs, _ in sources + scopes:
        expected = {"pdf_pages", "book_pages"}
        if set(attrs) != expected:
            issue("metadata-attributes", f"luna:{kind} must contain exactly pdf_pages and book_pages")
            continue
        pdf_range = page_range(attrs["pdf_pages"])
        book_range = page_range(attrs["book_pages"])
        is_front_matter = (
            kind == "source"
            and path == root / "index.md"
            and attrs["book_pages"] == "目录页"
        )
        if is_front_matter:
            if not pdf_range:
                issue("invalid-page-range", "front-matter luna:source has an invalid PDF page range")
            else:
                parsed_ranges[kind] = pdf_range
            continue
        if not pdf_range or not book_range:
            issue("invalid-page-range", f"luna:{kind} has an invalid or descending page range")
            continue
        if pdf_range[1] - pdf_range[0] != book_range[1] - book_range[0]:
            issue("range-length-mismatch", f"luna:{kind} PDF and book ranges have different lengths")
        if book_page_offset is not None and (
            pdf_range[0] - book_range[0] != book_page_offset
            or pdf_range[1] - book_range[1] != book_page_offset
        ):
            issue("page-offset-mismatch", f"luna:{kind} does not preserve PDF-book offset {book_page_offset}")
        parsed_ranges[kind] = pdf_range

    if "scope" in parsed_ranges and "source" in parsed_ranges:
        source_range = parsed_ranges["source"]
        scope_range = parsed_ranges["scope"]
        if source_range[0] != scope_range[0]:
            issue("scope-start-mismatch", "luna:source must be the first real page of luna:scope")
        if source_range[1] > scope_range[1]:
            issue("source-outside-scope", "luna:source must stay inside luna:scope")

    seen_markers: set[tuple[int, int]] = set()
    coverage = parsed_ranges.get("scope") or parsed_ranges.get("source")
    for _, attrs, _ in page_markers:
        if set(attrs) != {"pdf_page", "book_page"}:
            issue("metadata-attributes", "luna:page must contain exactly pdf_page and book_page")
            continue
        try:
            pdf_page, book_page = int(attrs["pdf_page"]), int(attrs["book_page"])
        except ValueError:
            issue("invalid-page-marker", "luna:page values must be integers")
            continue
        marker = (pdf_page, book_page)
        if marker in seen_markers:
            issue("duplicate-page-marker", f"duplicate luna:page marker for PDF {pdf_page} / book {book_page}")
        seen_markers.add(marker)
        if book_page_offset is not None and pdf_page - book_page != book_page_offset:
            issue(
                "page-offset-mismatch",
                f"luna:page PDF {pdf_page} / book {book_page} does not preserve offset {book_page_offset}",
            )
        if coverage and not coverage[0] <= pdf_page <= coverage[1]:
            issue(
                "page-marker-outside-source",
                f"PDF page marker {pdf_page} is outside declared coverage {coverage[0]}-{coverage[1]}",
            )
    # Chapter indexes conventionally use an H1.  Per-question source slices
    # (question-*.md / answer-*.md) intentionally retain the original H3/H4
    # heading so their source backlink is self-contained; requiring H1 there
    # would create a false failure and tempt agents to rewrite the source title.
    is_source_slice = path.name.startswith(("question-", "answer-"))
    if not re.search(r"^#\s+\S", text, re.MULTILINE) and not (is_source_slice and HEADING_RE.search(text)):
        issue("missing-title", "page has no heading suitable for a source page")
    if not allow_review and REVIEW_RE.search(text):
        issue("review-marker", "unresolved luna:review marker remains")
    if FIGURE_PLACEHOLDER_RE.search(text):
        issue("figure-placeholder", "unresolved figure placeholder remains")
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
        elif target.suffix.lower() == ".svg":
            try:
                ET.parse(target)
            except ET.ParseError as error:
                issue("invalid-svg", f"{relative}: {error}")

    for match in LINK_RE.finditer(text):
        raw_target = match.group(1)
        if raw_target.strip().startswith("#"):
            continue
        target = relative_target(path, raw_target)
        if target is None:
            continue
        if target.is_dir():
            target = target / "index.md"
        if not target.is_file():
            issue("broken-link", f"local link target does not exist: {raw_target}")

    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--report", type=Path)
    parser.add_argument("--allow-review-markers", action="store_true")
    parser.add_argument("--include-work", action="store_true", help="also audit non-canonical work/review directories")
    parser.add_argument("--book-page-offset", type=int, help="require PDF page minus book page to equal this value")
    args = parser.parse_args()
    root = args.root.resolve()
    if not root.is_dir():
        parser.error(f"output root not found: {root}")

    markdown_files = sorted(
        page
        for page in root.rglob("*.md")
        if args.include_work
        or not any(part in SKIPPED_DIRECTORIES for part in page.relative_to(root).parts[:-1])
    )
    issues = [
        issue
        for page in markdown_files
        for issue in audit_file(page, root, args.allow_review_markers, args.book_page_offset)
    ]
    for issue in issues:
        print(f"{issue['file']}: {issue['kind']}: {issue['detail']}")
    result = {
        "version": 2,
        "root": str(root),
        "markdown_files": len(markdown_files),
        "excluded_directories": [] if args.include_work else sorted(SKIPPED_DIRECTORIES),
        "issues": issues,
        "ok": not issues,
    }
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if not issues:
        print(f"LUNA Markdown audit passed: {len(markdown_files)} Markdown files")
        return 0
    print(f"LUNA Markdown audit failed: {len(issues)} issue(s)", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
