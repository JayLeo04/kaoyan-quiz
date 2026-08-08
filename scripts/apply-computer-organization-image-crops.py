from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path

from PIL import Image, ImageOps


PROJECT_ROOT = Path(__file__).resolve().parents[1]
AUDIT_ROOT = PROJECT_ROOT / "tmp" / "pdfs" / "computer-organization-image-audit"
INVENTORY_PATH = AUDIT_ROOT / "image-inventory.json"
PROPOSALS_PATH = AUDIT_ROOT / "crop-proposals.json"


def parse_indices(value: str) -> set[int]:
    indices: set[int] = set()
    for part in value.split(","):
        item = part.strip()
        if not item:
            continue
        if "-" in item:
            start, end = (int(number) for number in item.split("-", 1))
            indices.update(range(start, end + 1))
        else:
            indices.add(int(item))
    return indices


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--indices", required=True, help="Comma-separated indices and inclusive ranges to crop.")
    parser.add_argument("--group", required=True, help="Unique report/backup group name.")
    parser.add_argument("--range", required=True, dest="audit_range", help="Inclusive audited range, for example 353-407.")
    args = parser.parse_args()

    accepted = parse_indices(args.indices)
    audited = parse_indices(args.audit_range)
    inventory = json.loads(INVENTORY_PATH.read_text(encoding="utf-8"))
    proposals = json.loads(PROPOSALS_PATH.read_text(encoding="utf-8"))
    inventory_by_index = {record["index"]: record for record in inventory["records"]}
    proposals_by_index = {record["index"]: record for record in proposals["records"]}
    missing = sorted(index for index in accepted if index not in proposals_by_index)
    if missing:
        raise SystemExit(f"Missing crop proposals for indices: {missing}")
    if not accepted.issubset(audited):
        raise SystemExit("Every accepted index must belong to the audited range.")

    backup_root = AUDIT_ROOT / "before-recrop" / args.group
    report_root = AUDIT_ROOT / "reports"
    report_root.mkdir(parents=True, exist_ok=True)
    report = []
    for index in sorted(audited):
        record = inventory_by_index[index]
        path = Path(record["absolutePath"])
        original_size = [record["width"], record["height"]]
        if index not in accepted:
            report.append({
                "index": index,
                "path": record["path"],
                "status": "pass",
                "reason": "目视审核未见无关正文、页眉页码、截断或清晰度问题。",
                "originalSize": original_size,
                "newSize": original_size,
                "cropBox": None,
            })
            continue

        proposal = proposals_by_index[index]
        box = tuple(int(value) for value in proposal["box"])
        relative = path.relative_to(PROJECT_ROOT)
        backup = backup_root / relative
        backup.parent.mkdir(parents=True, exist_ok=True)
        if not backup.exists():
            shutil.copy2(path, backup)
        with Image.open(backup) as source:
            image = ImageOps.exif_transpose(source).convert("RGBA")
            cropped = image.crop(box)
            new_size = list(cropped.size)
            cropped.save(path, format="PNG", optimize=True)
        report.append({
            "index": index,
            "path": record["path"],
            "status": "recropped",
            "reason": "移除原截图中混入的无关正文、页眉页码或相邻内容，保留原图表及必要标注。",
            "originalSize": original_size,
            "newSize": new_size,
            "cropBox": list(box),
        })

    report_path = report_root / f"{args.group}.json"
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "group": args.group,
        "audited": len(audited),
        "recropped": len(accepted),
        "passed": len(audited) - len(accepted),
        "report": str(report_path.relative_to(PROJECT_ROOT)).replace("\\", "/"),
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
