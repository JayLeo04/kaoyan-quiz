from __future__ import annotations

import argparse
import json
import math
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


PROJECT_ROOT = Path(__file__).resolve().parents[1]
AUDIT_ROOT = PROJECT_ROOT / "tmp" / "pdfs" / "computer-organization-image-audit"
INVENTORY_PATH = AUDIT_ROOT / "image-inventory.json"


def parse_indices(value: str) -> set[int]:
    result: set[int] = set()
    for item in value.split(","):
        item = item.strip()
        if not item:
            continue
        if "-" in item:
            start, end = (int(part) for part in item.split("-", 1))
            result.update(range(start, end + 1))
        else:
            result.add(int(item))
    return result


def font(size: int) -> ImageFont.ImageFont:
    for path in (Path("C:/Windows/Fonts/msyh.ttc"), Path("C:/Windows/Fonts/arial.ttf")):
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--indices", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    wanted = parse_indices(args.indices)
    inventory = json.loads(INVENTORY_PATH.read_text(encoding="utf-8"))
    records = [record for record in inventory["records"] if record["index"] in wanted]
    records.sort(key=lambda record: record["index"])

    columns = 8
    cell_width = 360
    cell_height = 310
    rows = math.ceil(len(records) / columns)
    canvas = Image.new("RGB", (columns * cell_width, rows * cell_height), "#e5e7eb")
    draw = ImageDraw.Draw(canvas)
    label_font = font(16)
    tiny_font = font(14)
    for local_index, record in enumerate(records):
        column = local_index % columns
        row = local_index // columns
        left = column * cell_width
        top = row * cell_height
        draw.rectangle((left + 4, top + 4, left + cell_width - 4, top + cell_height - 4), fill="white", outline="#94a3b8", width=2)
        path = Path(record["absolutePath"])
        with Image.open(path) as source:
            image = ImageOps.exif_transpose(source).convert("RGBA")
            flattened = Image.new("RGBA", image.size, "white")
            flattened.alpha_composite(image)
            thumbnail = flattened.convert("RGB")
            size = image.size
        thumbnail.thumbnail((336, 242), Image.Resampling.LANCZOS)
        canvas.paste(thumbnail, (left + (cell_width - thumbnail.width) // 2, top + 10 + (242 - thumbnail.height) // 2))
        location = f'{record["section"]}/{record["filename"]}'
        if len(location) > 42:
            location = f'…{location[-41:]}'
        draw.text((left + 10, top + 258), f'{record["index"]:03d}  {location}', fill="#0f172a", font=label_font)
        draw.text((left + 10, top + 281), f'{size[0]}×{size[1]}  PDF {record.get("pdfPage") or "?"}', fill="#475569", font=tiny_font)

    output = Path(args.output)
    if not output.is_absolute():
        output = PROJECT_ROOT / output
    output.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output, optimize=True)
    print(str(output))


if __name__ == "__main__":
    main()
