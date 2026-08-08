from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image, ImageOps


PROJECT_ROOT = Path(__file__).resolve().parents[1]
AUDIT_ROOT = PROJECT_ROOT / "tmp" / "pdfs" / "computer-organization-image-audit"
INVENTORY_PATH = AUDIT_ROOT / "image-inventory.json"

# Pixel boxes are verified against the full-resolution source asset.
MANUAL_CROPS = {
    345: (0, 0, 660, 1110),
    378: (25, 32, 475, 132),
}

PDF_PAGE_CROPS = {
    94: {
        "source": AUDIT_ROOT / "pdf-pages" / "root-review-94" / "pdf-126-126.png",
        "box": (455, 1145, 1225, 1455),
    },
}


def main() -> None:
    inventory = json.loads(INVENTORY_PATH.read_text(encoding="utf-8"))
    records = {record["index"]: record for record in inventory["records"]}
    results = []
    for index, box in MANUAL_CROPS.items():
        record = records[index]
        path = Path(record["absolutePath"])
        backup = AUDIT_ROOT / "before-recrop" / "manual" / path.relative_to(PROJECT_ROOT)
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            shutil.copy2(path, backup)
        with Image.open(backup) as source:
            image = ImageOps.exif_transpose(source).convert("RGBA")
            original_size = image.size
            cropped = image.crop(box)
            cropped.save(path, format="PNG", optimize=True)
        results.append({
            "index": index,
            "path": record["path"],
            "box": list(box),
            "originalSize": list(original_size),
            "newSize": list(cropped.size),
        })
    for index, replacement in PDF_PAGE_CROPS.items():
        record = records[index]
        path = Path(record["absolutePath"])
        backup = AUDIT_ROOT / "before-recrop" / "manual" / path.relative_to(PROJECT_ROOT)
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            shutil.copy2(path, backup)
        source_path = Path(replacement["source"])
        box = tuple(replacement["box"])
        with Image.open(source_path) as source:
            page = ImageOps.exif_transpose(source).convert("RGBA")
            cropped = page.crop(box)
            cropped.save(path, format="PNG", optimize=True)
        results.append({
            "index": index,
            "path": record["path"],
            "box": list(box),
            "originalSize": [record["width"], record["height"]],
            "newSize": list(cropped.size),
            "cropSource": str(source_path.relative_to(PROJECT_ROOT)).replace("\\", "/"),
        })
    output = AUDIT_ROOT / "reports" / "manual-crops.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
