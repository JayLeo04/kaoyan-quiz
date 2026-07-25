#!/usr/bin/env python3
"""Build overlapping, primary-section PDFs from this book's bookmark export."""

from __future__ import annotations

import argparse
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

from pypdf import PdfReader, PdfWriter


EXCLUDED_SUFFIXES = ("思考题", "练习答案", "参考文献")


def is_excluded(name: str) -> bool:
    return any(name == suffix or name.endswith(f"　{suffix}") for suffix in EXCLUDED_SUFFIXES)


def section_id(name: str) -> str:
    match = re.match(r"^(\d+(?:\.\d+)*)", name)
    if not match:
        raise ValueError(f"Primary section lacks a numeric identifier: {name}")
    return "os-" + match.group(1).replace(".", "-")


def bookmark_items(path: Path) -> list[dict[str, object]]:
    root = ET.parse(path).getroot()
    items: list[dict[str, object]] = []
    for item in root.iter("ITEM"):
        raw_page = (item.get("PAGE") or "").strip()
        items.append(
            {
                "name": (item.get("NAME") or "").strip(),
                "page": int(raw_page) if raw_page.isdigit() else None,
                "indent": int(item.get("INDENT") or 0),
            }
        )
    return items


def build_sections(items: list[dict[str, object]], total_pages: int, overlap: int) -> list[dict[str, object]]:
    sections: list[dict[str, object]] = []
    for index, item in enumerate(items):
        name = str(item["name"])
        page = item["page"]
        if item["indent"] != 1 or page is None or is_excluded(name):
            continue

        next_page = total_pages + 1
        for candidate in items[index + 1 :]:
            if candidate["indent"] <= 1 and candidate["page"] is not None:
                next_page = int(candidate["page"])
                break

        core_start = int(page)
        core_end = max(core_start, next_page - 1)
        slice_start = max(1, core_start - overlap)
        slice_end = min(total_pages, core_end + overlap)
        sections.append(
            {
                "id": section_id(name),
                "title": name,
                "core_start": core_start,
                "core_end": core_end,
                "slice_start": slice_start,
                "slice_end": slice_end,
            }
        )
    return sections


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--bookmarks", type=Path, required=True)
    parser.add_argument("--out", type=Path, required=True)
    parser.add_argument("--overlap", type=int, default=1)
    args = parser.parse_args()

    if args.overlap < 0:
        raise ValueError("overlap must be zero or greater")

    reader = PdfReader(args.source)
    sections = build_sections(bookmark_items(args.bookmarks), len(reader.pages), args.overlap)
    args.out.mkdir(parents=True, exist_ok=True)

    for section in sections:
        file_name = f"{section['id']}-p{section['slice_start']:03d}-{section['slice_end']:03d}.pdf"
        output = args.out / file_name
        writer = PdfWriter()
        for page_index in range(section["slice_start"] - 1, section["slice_end"]):
            writer.add_page(reader.pages[page_index])
        writer.add_metadata({"/Title": str(section["title"])})
        with output.open("wb") as stream:
            writer.write(stream)
        section["file"] = file_name

    manifest = {
        "source_pages": len(reader.pages),
        "overlap_pages": args.overlap,
        "sections": sections,
    }
    (args.out / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Wrote {len(sections)} overlapping section PDFs to {args.out}")


if __name__ == "__main__":
    main()
