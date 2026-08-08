from __future__ import annotations

import json
import math
import re
from collections import defaultdict
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageStat


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SECTIONS_ROOT = PROJECT_ROOT / "source-materials" / "computer-organization-tang-shuofei-3e" / "work" / "sections"
AUDIT_ROOT = PROJECT_ROOT / "tmp" / "pdfs" / "computer-organization-image-audit"
CONTACT_ROOT = AUDIT_ROOT / "contact-sheets"
MANIFEST_PATH = AUDIT_ROOT / "image-inventory.json"

MEDIA_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp"}
SOURCE_RE = re.compile(r"<!--\s*luna:(?:source|page)\s+([\s\S]*?)-->")
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^)]+)\)")
ATTRIBUTE_RE = re.compile(r"([A-Za-z_]+)=(?:\"([^\"]*)\"|'([^']*)')")


def parse_attributes(value: str) -> dict[str, str]:
    return {match.group(1): match.group(2) or match.group(3) or "" for match in ATTRIBUTE_RE.finditer(value)}


def first_page_number(value: str | None) -> int | None:
    if not value:
        return None
    match = re.search(r"\d+", value)
    return int(match.group()) if match else None


def source_pdf_page(attributes: dict[str, str], alt: str) -> tuple[int | None, str | None]:
    alt_match = re.search(r"(?:PDF|pdf)\s*(?:第\s*)?(\d+)", alt)
    if alt_match:
        return int(alt_match.group(1)), "alt"
    for key in (
        "original_pdf_page",
        "original_pdf_pages",
        "source_pdf_page",
        "source_pdf_pages",
    ):
        page = first_page_number(attributes.get(key))
        if page is not None:
            return page, key
    book_page = first_page_number(attributes.get("book_page") or attributes.get("book_pages"))
    for key in ("pdf_page", "pdf_pages"):
        page = first_page_number(attributes.get(key))
        if page is None:
            continue
        if book_page is not None and page != book_page + 6:
            return book_page + 6, "book-page-plus-6"
        return page, key
    if book_page is not None:
        return book_page + 6, "book-page-plus-6"
    return None, None


def resolve_image_href(markdown_path: Path, raw_href: str) -> Path | None:
    href = raw_href.strip()
    if href.startswith("<") and ">" in href:
        href = href[1 : href.index(">")]
    else:
        href = re.split(r"\s+[\"']", href, maxsplit=1)[0]
    href = href.split("#", 1)[0].split("?", 1)[0]
    if not href or re.match(r"^(?:https?:|data:)", href, re.I):
        return None
    return (markdown_path.parent / href).resolve()


def image_metrics(image_path: Path) -> dict[str, object]:
    with Image.open(image_path) as source:
        image = ImageOps.exif_transpose(source).convert("RGB")
        width, height = image.size
        sample = image.copy()
        sample.thumbnail((1000, 1000), Image.Resampling.LANCZOS)
        gray = ImageOps.grayscale(sample)
        pixels = np.asarray(gray)
        dark_ratio = float(np.mean(pixels < 205))
        very_dark_ratio = float(np.mean(pixels < 80))
        border_width = max(1, min(4, min(sample.size) // 80))
        edge_mask = np.zeros(pixels.shape, dtype=bool)
        edge_mask[:border_width, :] = True
        edge_mask[-border_width:, :] = True
        edge_mask[:, :border_width] = True
        edge_mask[:, -border_width:] = True
        edge_ink_ratio = float(np.mean(pixels[edge_mask] < 170))

        row_coverage = np.mean(pixels < 170, axis=1)
        text_like_row_ratio = float(np.mean((row_coverage >= 0.03) & (row_coverage <= 0.65)))

        aspect = width / max(1, height)
        flags: list[str] = []
        if width < 260 or height < 140:
            flags.append("low-resolution")
        if height / max(1, width) > 2.4:
            flags.append("very-tall")
        if width / max(1, height) > 6.0:
            flags.append("very-wide")
        if width >= 900 and height >= 1250 and 0.58 <= aspect <= 0.82:
            flags.append("page-like-crop")
        if edge_ink_ratio >= 0.045:
            flags.append("ink-at-edge")
        if text_like_row_ratio >= 0.42 and height >= 450:
            flags.append("text-dense")
        if dark_ratio < 0.003:
            flags.append("nearly-blank")

        return {
            "width": width,
            "height": height,
            "aspectRatio": round(aspect, 4),
            "bytes": image_path.stat().st_size,
            "mode": source.mode,
            "format": source.format,
            "meanLuminance": round(ImageStat.Stat(gray).mean[0], 2),
            "darkRatio": round(dark_ratio, 5),
            "veryDarkRatio": round(very_dark_ratio, 5),
            "edgeInkRatio": round(edge_ink_ratio, 5),
            "textLikeRowRatio": round(text_like_row_ratio, 5),
            "candidateFlags": flags,
        }


def load_font(size: int) -> ImageFont.ImageFont:
    candidates = [
        Path("C:/Windows/Fonts/msyh.ttc"),
        Path("C:/Windows/Fonts/arial.ttf"),
        Path("C:/Windows/Fonts/segoeui.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def flattened_thumbnail(image_path: Path, size: tuple[int, int]) -> Image.Image:
    with Image.open(image_path) as source:
        image = ImageOps.exif_transpose(source).convert("RGBA")
        flattened = Image.new("RGBA", image.size, "white")
        flattened.alpha_composite(image)
        flattened = flattened.convert("RGB")
        flattened.thumbnail(size, Image.Resampling.LANCZOS)
        return flattened


def create_contact_sheets(records: list[dict[str, object]], per_sheet: int = 32) -> list[str]:
    CONTACT_ROOT.mkdir(parents=True, exist_ok=True)
    for old_sheet in CONTACT_ROOT.glob("contact-*.png"):
        old_sheet.unlink()
    columns = 8
    rows = math.ceil(per_sheet / columns)
    cell_width = 360
    cell_height = 310
    image_box = (336, 242)
    label_font = load_font(16)
    tiny_font = load_font(14)
    outputs: list[str] = []
    for sheet_index, offset in enumerate(range(0, len(records), per_sheet), start=1):
        sheet_records = records[offset : offset + per_sheet]
        canvas = Image.new("RGB", (columns * cell_width, rows * cell_height), "#e5e7eb")
        draw = ImageDraw.Draw(canvas)
        for local_index, record in enumerate(sheet_records):
            column = local_index % columns
            row = local_index // columns
            left = column * cell_width
            top = row * cell_height
            draw.rectangle((left + 4, top + 4, left + cell_width - 4, top + cell_height - 4), fill="white", outline="#94a3b8", width=2)
            thumbnail = flattened_thumbnail(Path(str(record["absolutePath"])), image_box)
            image_left = left + (cell_width - thumbnail.width) // 2
            image_top = top + 10 + (image_box[1] - thumbnail.height) // 2
            canvas.paste(thumbnail, (image_left, image_top))
            label_top = top + 258
            location = f'{record["section"]}/{record["filename"]}'
            if len(location) > 42:
                location = f'…{location[-41:]}'
            page = record.get("pdfPage") or "?"
            draw.text((left + 10, label_top), f'{record["index"]:03d}  {location}', fill="#0f172a", font=label_font)
            draw.text(
                (left + 10, label_top + 23),
                f'{record["width"]}×{record["height"]}  PDF {page}  {",".join(record["candidateFlags"]) or "ok"}',
                fill="#475569",
                font=tiny_font,
            )
        output = CONTACT_ROOT / f"contact-{sheet_index:02d}.png"
        canvas.save(output, optimize=True)
        outputs.append(str(output.relative_to(PROJECT_ROOT)).replace("\\", "/"))
    return outputs


def main() -> None:
    references: dict[str, list[dict[str, object]]] = defaultdict(list)
    for markdown_path in sorted(SECTIONS_ROOT.rglob("index.md")):
        markdown = markdown_path.read_text(encoding="utf-8")
        current_source: dict[str, str] = {}
        events = []
        events.extend((match.start(), "source", match) for match in SOURCE_RE.finditer(markdown))
        events.extend((match.start(), "image", match) for match in IMAGE_RE.finditer(markdown))
        for _, kind, match in sorted(events, key=lambda item: item[0]):
            if kind == "source":
                current_source = parse_attributes(match.group(1))
                continue
            alt, raw_href = match.group(1), match.group(2)
            image_path = resolve_image_href(markdown_path, raw_href)
            if image_path is None:
                continue
            page, page_source = source_pdf_page(current_source, alt)
            key = str(image_path).casefold()
            references[key].append(
                {
                    "markdown": str(markdown_path.relative_to(PROJECT_ROOT)).replace("\\", "/"),
                    "href": raw_href.strip(),
                    "alt": alt,
                    "pdfPage": page,
                    "pdfPageSource": page_source,
                    "sourceAttributes": current_source,
                }
            )

    asset_paths = sorted(
        path.resolve()
        for path in SECTIONS_ROOT.rglob("*")
        if path.is_file() and path.suffix.lower() in MEDIA_EXTENSIONS and "assets" in path.relative_to(SECTIONS_ROOT).parts
    )
    records: list[dict[str, object]] = []
    for index, image_path in enumerate(asset_paths, start=1):
        key = str(image_path).casefold()
        image_references = references.get(key, [])
        relative = image_path.relative_to(SECTIONS_ROOT)
        section = relative.parts[0] if relative.parts else "unknown"
        metrics = image_metrics(image_path)
        pages = [reference["pdfPage"] for reference in image_references if reference.get("pdfPage") is not None]
        filename_book_page = re.search(r"-page-(\d+)(?:\D|$)", image_path.stem)
        if not pages and filename_book_page:
            pages = [int(filename_book_page.group(1)) + 6]
            for reference in image_references:
                reference["pdfPage"] = pages[0]
                reference["pdfPageSource"] = "filename-book-page-plus-6"
        record = {
            "index": index,
            "section": section,
            "filename": image_path.name,
            "path": str(image_path.relative_to(PROJECT_ROOT)).replace("\\", "/"),
            "absolutePath": str(image_path),
            "referenceCount": len(image_references),
            "pdfPage": pages[0] if pages else None,
            "pdfPages": sorted(set(pages)),
            "references": image_references,
            **metrics,
        }
        if not image_references:
            record["candidateFlags"].append("unreferenced")
        if len(set(pages)) > 1:
            record["candidateFlags"].append("conflicting-page-map")
        records.append(record)

    contact_sheets = create_contact_sheets(records)
    mapped = sum(record["pdfPage"] is not None for record in records)
    candidate_counts: dict[str, int] = defaultdict(int)
    for record in records:
        for flag in record["candidateFlags"]:
            candidate_counts[flag] += 1
    inventory = {
        "version": 1,
        "root": str(SECTIONS_ROOT.relative_to(PROJECT_ROOT)).replace("\\", "/"),
        "uniqueAssets": len(records),
        "markdownReferences": sum(record["referenceCount"] for record in records),
        "mappedToPdfPage": mapped,
        "unmappedToPdfPage": len(records) - mapped,
        "candidateFlagCounts": dict(sorted(candidate_counts.items())),
        "contactSheets": contact_sheets,
        "records": records,
    }
    AUDIT_ROOT.mkdir(parents=True, exist_ok=True)
    MANIFEST_PATH.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: inventory[key] for key in inventory if key != "records"}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
