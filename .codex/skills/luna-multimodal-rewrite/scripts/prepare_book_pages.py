#!/usr/bin/env python3
"""Render selected PDF pages to images and write a stable page manifest."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def parse_page_ranges(value: str | None, total_pages: int) -> list[int]:
    if not value:
        return list(range(1, total_pages + 1))

    pages: set[int] = set()
    for token in value.split(","):
        token = token.strip()
        if not token:
            continue
        if "-" in token:
            left, right = token.split("-", 1)
            start, end = int(left), int(right)
            if start > end:
                raise ValueError(f"invalid page range: {token}")
            pages.update(range(start, end + 1))
        else:
            pages.add(int(token))

    if not pages or min(pages) < 1 or max(pages) > total_pages:
        raise ValueError(f"pages must be between 1 and {total_pages}")
    return sorted(pages)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True, help="input PDF")
    parser.add_argument("--out", type=Path, required=True, help="manifest/output directory")
    parser.add_argument("--pages", help="1-based pages, e.g. 1-4,9,12-13; default: all")
    parser.add_argument("--dpi", type=int, default=260)
    parser.add_argument("--overwrite", action="store_true")
    args = parser.parse_args()

    if args.dpi < 72:
        parser.error("--dpi must be at least 72")
    if not args.source.is_file():
        parser.error(f"source PDF not found: {args.source}")

    try:
        import fitz  # type: ignore
    except ImportError:
        print("PyMuPDF is required only to render page images.", file=sys.stderr)
        return 2

    document = fitz.open(args.source)
    try:
        page_numbers = parse_page_ranges(args.pages, len(document))
        image_dir = args.out / "pages"
        image_dir.mkdir(parents=True, exist_ok=True)
        records: list[dict[str, object]] = []
        scale = args.dpi / 72
        matrix = fitz.Matrix(scale, scale)

        for page_number in page_numbers:
            output = image_dir / f"page-{page_number:04d}.png"
            if not output.exists() or args.overwrite:
                pixmap = document[page_number - 1].get_pixmap(matrix=matrix, alpha=False)
                pixmap.save(output)
            pixmap = fitz.Pixmap(output.as_posix())
            records.append(
                {
                    "pdf_page": page_number,
                    "image": output.relative_to(args.out).as_posix(),
                    "width": pixmap.width,
                    "height": pixmap.height,
                }
            )

        manifest = {
            "version": 1,
            "source_pdf": str(args.source.resolve()),
            "pdf_page_count": len(document),
            "dpi": args.dpi,
            "pages": records,
        }
        args.out.mkdir(parents=True, exist_ok=True)
        (args.out / "manifest.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"Rendered {len(records)} pages into {image_dir}")
        return 0
    finally:
        document.close()


if __name__ == "__main__":
    raise SystemExit(main())
