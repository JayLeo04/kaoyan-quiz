from __future__ import annotations

import json
import math
import shutil
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps


PROJECT_ROOT = Path(__file__).resolve().parents[1]
AUDIT_ROOT = PROJECT_ROOT / "tmp" / "pdfs" / "computer-organization-image-audit"
INVENTORY_PATH = AUDIT_ROOT / "image-inventory.json"
PROPOSAL_ROOT = AUDIT_ROOT / "crop-proposals"
BACKUP_ROOT = AUDIT_ROOT / "before-recrop"

# Visual review of all 13 contact sheets. These are the assets containing
# unrelated prose, running headers/page numbers, or overly broad page crops.
REVIEWED_CANDIDATE_INDICES = {
    2, 7, 14, 15, 24, 26, 27, 30, 34, 36, 37, 38, 41, 42, 44, 50, 52, 54,
    57, 60, 61, 62, 63, 64, 65, 66, 68, 70, 71, 75, 78, 80, 82, 84, 86, 87,
    88, 89, 90, 91, 92, 94, 95, 96, 97, 98, 101, 105, 106, 107, 108, 110,
    111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 123, 124, 128,
    129, 130, 136, 141, 143, 153, 154, 162, 169, 171, 177, 178, 182, 185,
    191, 192, 193, 194, 195, 196, 197, 199, 200, 201, 202, 203, 204, 205,
    206, 207, 208, 209, 210, 211, 213, 214, 215, 216, 217, 218, 219, 220,
    221, 223, 224, 225, 228, 229, 230, 231, 233, 235, 236, 237, 238, 240,
    241, 243, 244, 246, 248, 249, 251, 252, 253, 256, 257, 258, 261, 262,
    267, 268, 269, 270, 271, 272, 274, 276, 277, 281, 282, 283, 284, 285,
    286, 287, 289, 290, 291, 292, 293, 296, 297, 298, 299, 300, 301, 302,
    304, 305, 307, 308, 309, 310, 311, 317, 318, 319, 320, 321, 323, 329,
    330, 331, 332, 334, 335, 336, 338, 340, 341, 343, 344, 345, 346, 348,
    349, 350, 353, 354, 357, 358, 359, 361, 362, 364, 365, 381, 384, 385,
    391, 392, 397, 398, 399, 400, 401, 402, 403, 404, 405,
}


def load_font(size: int) -> ImageFont.ImageFont:
    for candidate in (Path("C:/Windows/Fonts/msyh.ttc"), Path("C:/Windows/Fonts/arial.ttf")):
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def dilate_axis(mask: np.ndarray, radius: int, axis: int) -> np.ndarray:
    if radius <= 0:
        return mask
    window = radius * 2 + 1
    if axis == 1:
        padded = np.pad(mask, ((0, 0), (radius, radius)), constant_values=False)
        cumulative = np.pad(np.cumsum(padded, axis=1, dtype=np.int32), ((0, 0), (1, 0)))
        return (cumulative[:, window:] - cumulative[:, :-window]) > 0
    padded = np.pad(mask, ((radius, radius), (0, 0)), constant_values=False)
    cumulative = np.pad(np.cumsum(padded, axis=0, dtype=np.int32), ((1, 0), (0, 0)))
    return (cumulative[window:, :] - cumulative[:-window, :]) > 0


class DisjointSet:
    def __init__(self) -> None:
        self.parent: list[int] = []

    def add(self) -> int:
        label = len(self.parent)
        self.parent.append(label)
        return label

    def find(self, value: int) -> int:
        while self.parent[value] != value:
            self.parent[value] = self.parent[self.parent[value]]
            value = self.parent[value]
        return value

    def union(self, left: int, right: int) -> int:
        left_root = self.find(left)
        right_root = self.find(right)
        if left_root != right_root:
            self.parent[right_root] = left_root
        return left_root


def connected_boxes(mask: np.ndarray) -> list[tuple[int, int, int, int]]:
    sets = DisjointSet()
    runs: list[tuple[int, int, int, int]] = []
    previous: list[tuple[int, int, int]] = []
    for y, row in enumerate(mask):
        changes = np.diff(np.pad(row.astype(np.int8), (1, 1)))
        starts = np.flatnonzero(changes == 1)
        ends = np.flatnonzero(changes == -1) - 1
        current: list[tuple[int, int, int]] = []
        for x0, x1 in zip(starts.tolist(), ends.tolist(), strict=True):
            overlaps = [label for prior_x0, prior_x1, label in previous if prior_x1 >= x0 and prior_x0 <= x1]
            label = overlaps[0] if overlaps else sets.add()
            for other in overlaps[1:]:
                sets.union(label, other)
            current.append((x0, x1, label))
            runs.append((y, x0, x1, label))
        previous = current

    boxes: dict[int, list[int]] = {}
    for y, x0, x1, label in runs:
        root = sets.find(label)
        if root not in boxes:
            boxes[root] = [x0, y, x1 + 1, y + 1]
        else:
            box = boxes[root]
            box[0] = min(box[0], x0)
            box[1] = min(box[1], y)
            box[2] = max(box[2], x1 + 1)
            box[3] = max(box[3], y + 1)
    return [tuple(box) for box in boxes.values()]


def overlap_ratio(a0: int, a1: int, b0: int, b1: int) -> float:
    overlap = max(0, min(a1, b1) - max(a0, b0))
    return overlap / max(1, min(a1 - a0, b1 - b0))


def merge_related_boxes(
    primary: tuple[int, int, int, int],
    boxes: list[tuple[int, int, int, int]],
    width: int,
    height: int,
) -> tuple[int, int, int, int]:
    merged = list(primary)
    changed = True
    while changed:
        changed = False
        for box in boxes:
            x0, y0, x1, y1 = box
            box_width = x1 - x0
            box_height = y1 - y0
            if box_width < width * 0.07 or box_height < height * 0.035:
                continue
            horizontal_gap = max(0, max(merged[0], x0) - min(merged[2], x1))
            vertical_gap = max(0, max(merged[1], y0) - min(merged[3], y1))
            same_row = overlap_ratio(merged[1], merged[3], y0, y1) >= 0.35 and horizontal_gap <= width * 0.055
            same_column = overlap_ratio(merged[0], merged[2], x0, x1) >= 0.45 and vertical_gap <= height * 0.035
            if not (same_row or same_column):
                continue
            expanded = [min(merged[0], x0), min(merged[1], y0), max(merged[2], x1), max(merged[3], y1)]
            if expanded != merged:
                merged = expanded
                changed = True
    return tuple(merged)


def suggest_crop(image: Image.Image) -> dict[str, object] | None:
    rgb = ImageOps.exif_transpose(image).convert("RGB")
    original_width, original_height = rgb.size
    scale = min(1.0, 900 / max(original_width, original_height))
    analysis = rgb.resize(
        (max(1, round(original_width * scale)), max(1, round(original_height * scale))),
        Image.Resampling.LANCZOS,
    )
    gray = np.asarray(ImageOps.grayscale(analysis))
    ink = gray < 205
    height, width = ink.shape
    expanded = dilate_axis(ink, max(2, width // 180), axis=1)
    expanded = dilate_axis(expanded, max(1, height // 500), axis=0)
    boxes = connected_boxes(expanded)
    substantial = []
    for box in boxes:
        x0, y0, x1, y1 = box
        box_width = x1 - x0
        box_height = y1 - y0
        if box_width < width * 0.13 or box_height < height * 0.045:
            continue
        area = box_width * box_height
        center_y = (y0 + y1) / 2 / max(1, height)
        center_weight = 1.0 - min(0.45, abs(center_y - 0.5) * 0.35)
        score = area * (0.8 + min(0.7, box_height / max(1, height))) * center_weight
        substantial.append((score, box))
    if not substantial:
        return None
    primary = max(substantial, key=lambda item: item[0])[1]
    merged = merge_related_boxes(primary, [box for _, box in substantial], width, height)

    margin_x = max(5, round(width * 0.018))
    margin_y = max(5, round(height * 0.018))
    x0 = max(0, merged[0] - margin_x)
    y0 = max(0, merged[1] - margin_y)
    x1 = min(width, merged[2] + margin_x)
    y1 = min(height, merged[3] + margin_y)
    original_box = (
        max(0, math.floor(x0 / scale)),
        max(0, math.floor(y0 / scale)),
        min(original_width, math.ceil(x1 / scale)),
        min(original_height, math.ceil(y1 / scale)),
    )
    total_ink = int(np.count_nonzero(ink))
    captured_ink = int(np.count_nonzero(ink[y0:y1, x0:x1]))
    crop_area = (original_box[2] - original_box[0]) * (original_box[3] - original_box[1])
    return {
        "box": original_box,
        "areaRatio": round(crop_area / max(1, original_width * original_height), 4),
        "inkCapturedRatio": round(captured_ink / max(1, total_ink), 4),
    }


def flatten(image: Image.Image) -> Image.Image:
    rgba = ImageOps.exif_transpose(image).convert("RGBA")
    background = Image.new("RGBA", rgba.size, "white")
    background.alpha_composite(rgba)
    return background.convert("RGB")


def thumbnail(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    output = flatten(image)
    output.thumbnail(size, Image.Resampling.LANCZOS)
    return output


def render_proposal_sheets(proposals: list[dict[str, object]]) -> list[str]:
    PROPOSAL_ROOT.mkdir(parents=True, exist_ok=True)
    for old in PROPOSAL_ROOT.glob("proposal-*.png"):
        old.unlink()
    columns = 4
    rows = 4
    per_sheet = columns * rows
    cell_width = 720
    cell_height = 330
    font = load_font(16)
    tiny_font = load_font(14)
    outputs = []
    for sheet_number, offset in enumerate(range(0, len(proposals), per_sheet), start=1):
        canvas = Image.new("RGB", (columns * cell_width, rows * cell_height), "#dbe2ea")
        draw = ImageDraw.Draw(canvas)
        for local_index, proposal in enumerate(proposals[offset : offset + per_sheet]):
            column = local_index % columns
            row = local_index // columns
            left = column * cell_width
            top = row * cell_height
            draw.rectangle((left + 4, top + 4, left + cell_width - 4, top + cell_height - 4), fill="white", outline="#94a3b8", width=2)
            path = Path(str(proposal["absolutePath"]))
            with Image.open(path) as source:
                original = flatten(source)
            marked = original.copy()
            ImageDraw.Draw(marked).rectangle(tuple(proposal["box"]), outline="#dc2626", width=max(3, min(original.size) // 180))
            cropped = original.crop(tuple(proposal["box"]))
            left_thumb = thumbnail(marked, (334, 245))
            right_thumb = thumbnail(cropped, (334, 245))
            canvas.paste(left_thumb, (left + 9 + (334 - left_thumb.width) // 2, top + 10 + (245 - left_thumb.height) // 2))
            canvas.paste(right_thumb, (left + 377 + (334 - right_thumb.width) // 2, top + 10 + (245 - right_thumb.height) // 2))
            label = f'{proposal["index"]:03d}  {proposal["section"]}/{proposal["filename"]}'
            if len(label) > 72:
                label = f'{label[:30]}…{label[-41:]}'
            draw.text((left + 10, top + 262), label, fill="#0f172a", font=font)
            draw.text(
                (left + 10, top + 287),
                f'area {proposal["areaRatio"]:.1%} · ink {proposal["inkCapturedRatio"]:.1%} · red=proposed crop',
                fill="#475569",
                font=tiny_font,
            )
        output = PROPOSAL_ROOT / f"proposal-{sheet_number:02d}.png"
        canvas.save(output, optimize=True)
        outputs.append(str(output.relative_to(PROJECT_ROOT)).replace("\\", "/"))
    return outputs


def main() -> None:
    inventory = json.loads(INVENTORY_PATH.read_text(encoding="utf-8"))
    records = {record["index"]: record for record in inventory["records"]}
    proposals = []
    skipped = []
    for index in sorted(REVIEWED_CANDIDATE_INDICES):
        record = records[index]
        path = Path(record["absolutePath"])
        with Image.open(path) as image:
            suggestion = suggest_crop(image)
        if suggestion is None:
            skipped.append(index)
            continue
        proposals.append({
            "index": index,
            "section": record["section"],
            "filename": record["filename"],
            "path": record["path"],
            "absolutePath": record["absolutePath"],
            **suggestion,
        })
    sheets = render_proposal_sheets(proposals)
    output = {
        "reviewedCandidates": len(REVIEWED_CANDIDATE_INDICES),
        "proposals": len(proposals),
        "skipped": skipped,
        "sheets": sheets,
        "records": proposals,
    }
    (AUDIT_ROOT / "crop-proposals.json").write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({key: value for key, value in output.items() if key != "records"}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
