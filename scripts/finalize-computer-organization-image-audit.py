from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


PROJECT_ROOT = Path(__file__).resolve().parents[1]
BOOK_ROOT = PROJECT_ROOT / "source-materials" / "computer-organization-tang-shuofei-3e"
AUDIT_ROOT = PROJECT_ROOT / "tmp" / "pdfs" / "computer-organization-image-audit"
INVENTORY_PATH = AUDIT_ROOT / "image-inventory.json"
MANIFEST_PATH = BOOK_ROOT / "manifest.json"
FINAL_PATH = BOOK_ROOT / "work" / "IMAGE_AUDIT.json"
GROUP_REPORTS = [
    AUDIT_ROOT / "reports" / "group-a.json",
    AUDIT_ROOT / "reports" / "group-b.json",
    AUDIT_ROOT / "reports" / "group-c.json",
    AUDIT_ROOT / "reports" / "group-root.json",
]
MANUAL_REPORT = AUDIT_ROOT / "reports" / "manual-crops.json"
OVERRIDE_REPORTS = [
    AUDIT_ROOT / "reports" / "group-a-root-review.json",
    MANUAL_REPORT,
]
SECOND_PASS_REPORTS = [
    AUDIT_ROOT / "reports" / "group-a-second-pass-1-44.json",
    AUDIT_ROOT / "reports" / "group-a-second-pass-45-88.json",
    AUDIT_ROOT / "reports" / "group-a-second-pass-89-132.json",
    AUDIT_ROOT / "reports" / "group-b-second-pass.json",
    AUDIT_ROOT / "reports" / "group-c-second-pass.json",
]
FINAL_CROSS_FIX_REPORTS = [
    AUDIT_ROOT / "reports" / "final-cross-fixes-a.json",
    AUDIT_ROOT / "reports" / "final-cross-fixes-b.json",
    AUDIT_ROOT / "reports" / "final-cross-fixes-c.json",
]
EXPECTED_FINAL_CROSS_FIXES = {261, 262, 280, 334, 344, 371, 381, 385, 397}


def records_from_report(path: Path) -> list[dict[str, object]]:
    value = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(value, list):
        return value
    if isinstance(value, dict) and isinstance(value.get("records"), list):
        return value["records"]
    if isinstance(value, dict) and isinstance(value.get("items"), list):
        return value["items"]
    raise ValueError(f"Unsupported report shape: {path}")


def normalize_status(value: object) -> str:
    status = str(value or "").strip().lower().replace("_", "-")
    aliases = {
        "passed": "pass",
        "ok": "pass",
        "cropped": "recropped",
        "re-cropped": "recropped",
        "rerendered": "rerendered",
        "re-rendered": "rerendered",
        "needs-review": "needs-root-review",
    }
    return aliases.get(status, status)


def main() -> None:
    inventory = json.loads(INVENTORY_PATH.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    inventory_by_index = {record["index"]: record for record in inventory["records"]}
    reviewed: dict[int, dict[str, object]] = {}
    report_summaries = []
    for report_path in GROUP_REPORTS:
        if not report_path.exists():
            raise FileNotFoundError(report_path)
        records = records_from_report(report_path)
        for record in records:
            index = int(record["index"])
            if index in reviewed:
                raise ValueError(f"Duplicate review record for index {index}")
            reviewed[index] = dict(record)
        report_summaries.append({
            "path": str(report_path.relative_to(PROJECT_ROOT)).replace("\\", "/"),
            "records": len(records),
        })

    for override_path in OVERRIDE_REPORTS:
        if not override_path.exists():
            continue
        override_records = records_from_report(override_path)
        for override in override_records:
            index = int(override["index"])
            base = reviewed.get(index, {})
            reviewed[index] = {
                **base,
                **override,
            }
            if override_path == MANUAL_REPORT:
                reviewed[index]["status"] = "recropped"
                reviewed[index]["reason"] = "人工放大复核后进一步精裁，或从原 PDF 恢复缺失图表。"
        report_summaries.append({
            "path": str(override_path.relative_to(PROJECT_ROOT)).replace("\\", "/"),
            "records": len(override_records),
            "overrides": True,
        })

    second_pass_coverage: set[int] = set()
    for second_pass_path in SECOND_PASS_REPORTS:
        if not second_pass_path.exists():
            raise FileNotFoundError(second_pass_path)
        second_pass_records = records_from_report(second_pass_path)
        for second_pass_record in second_pass_records:
            index = int(second_pass_record["index"])
            if index in second_pass_coverage:
                raise ValueError(f"Duplicate second-pass review record for index {index}")
            second_pass_coverage.add(index)
            status = normalize_status(second_pass_record.get("status"))
            if status not in {"pass", "recropped", "rerendered"}:
                raise ValueError(f"Unsupported second-pass status for {index}: {second_pass_record.get('status')}")
            base = reviewed.get(index, {})
            if status == "pass":
                reviewed[index] = {
                    **base,
                    "secondPassStatus": status,
                    "secondPassReason": second_pass_record.get("reason") or "严格二次目视复核通过。",
                }
            else:
                reviewed[index] = {
                    **base,
                    **second_pass_record,
                    "secondPassStatus": status,
                    "secondPassReason": second_pass_record.get("reason") or "严格二次目视复核后修复。",
                }
        report_summaries.append({
            "path": str(second_pass_path.relative_to(PROJECT_ROOT)).replace("\\", "/"),
            "records": len(second_pass_records),
            "secondPass": True,
        })

    expected = set(inventory_by_index)
    actual = set(reviewed)
    if actual != expected:
        raise ValueError(f"Review coverage mismatch; missing={sorted(expected - actual)}, extra={sorted(actual - expected)}")
    if second_pass_coverage != expected:
        raise ValueError(
            "Second-pass coverage mismatch; "
            f"missing={sorted(expected - second_pass_coverage)}, extra={sorted(second_pass_coverage - expected)}"
        )

    final_cross_fix_coverage: set[int] = set()
    for final_cross_fix_path in FINAL_CROSS_FIX_REPORTS:
        if not final_cross_fix_path.exists():
            raise FileNotFoundError(final_cross_fix_path)
        final_cross_fix_records = records_from_report(final_cross_fix_path)
        for final_cross_fix_record in final_cross_fix_records:
            index = int(final_cross_fix_record["index"])
            if index in final_cross_fix_coverage:
                raise ValueError(f"Duplicate final cross-fix record for index {index}")
            final_cross_fix_coverage.add(index)
            status = normalize_status(final_cross_fix_record.get("status"))
            if status not in {"recropped", "rerendered"}:
                raise ValueError(f"Unsupported final cross-fix status for {index}: {final_cross_fix_record.get('status')}")
            reviewed[index] = {
                **reviewed[index],
                **final_cross_fix_record,
                "finalCrossFixStatus": status,
                "finalCrossFixReason": final_cross_fix_record.get("reason") or "独立交叉验收后修复。",
            }
        report_summaries.append({
            "path": str(final_cross_fix_path.relative_to(PROJECT_ROOT)).replace("\\", "/"),
            "records": len(final_cross_fix_records),
            "finalCrossFix": True,
        })
    if final_cross_fix_coverage != EXPECTED_FINAL_CROSS_FIXES:
        raise ValueError(
            "Final cross-fix coverage mismatch; "
            f"missing={sorted(EXPECTED_FINAL_CROSS_FIXES - final_cross_fix_coverage)}, "
            f"extra={sorted(final_cross_fix_coverage - EXPECTED_FINAL_CROSS_FIXES)}"
        )

    finalized = []
    for index in sorted(expected):
        inventory_record = inventory_by_index[index]
        review = reviewed[index]
        status = normalize_status(review.get("status"))
        crop_source = str(review.get("cropSource") or "").lower()
        if status == "recropped" and "pdf" in crop_source:
            status = "rerendered"
        if status not in {"pass", "recropped", "rerendered", "needs-root-review"}:
            raise ValueError(f"Unsupported status for {index}: {review.get('status')}")
        path = Path(inventory_record["absolutePath"])
        if not path.exists():
            raise FileNotFoundError(path)
        with Image.open(path) as image:
            current_size = list(image.size)
        finalized.append({
            "index": index,
            "section": inventory_record["section"],
            "path": inventory_record["path"],
            "pdfPage": inventory_record.get("pdfPage"),
            "referenceCount": inventory_record.get("referenceCount", 0),
            "status": status,
            "reason": review.get("reason") or "目视审核通过。",
            "originalSize": review.get("originalSize") or [inventory_record["width"], inventory_record["height"]],
            "currentSize": current_size,
            "cropBox": review.get("cropBox") or review.get("box"),
            "cropSource": review.get("cropSource"),
            "secondPassStatus": review.get("secondPassStatus"),
            "secondPassReason": review.get("secondPassReason"),
            "finalCrossFixStatus": review.get("finalCrossFixStatus"),
            "finalCrossFixReason": review.get("finalCrossFixReason"),
        })

    counts = {status: sum(record["status"] == status for record in finalized) for status in {record["status"] for record in finalized}}
    second_pass_counts = {
        status: sum(record["secondPassStatus"] == status for record in finalized)
        for status in {record["secondPassStatus"] for record in finalized}
        if status
    }
    if counts.get("needs-root-review", 0):
        raise ValueError(f"Image audit still has {counts['needs-root-review']} items requiring root review.")
    final = {
        "version": 1,
        "completedAt": datetime.now(timezone.utc).isoformat(),
        "book": {
            "id": "computer-organization-tang-shuofei-3e",
            "title": manifest.get("title"),
            "sourcePdf": manifest.get("source_pdf", {}).get("absolute_path"),
            "sourcePdfSha256": manifest.get("source_pdf", {}).get("sha256"),
        },
        "standard": "保留原教材图表、内部标注、子图标记与必要图注；移除无关正文、页眉、页码及相邻内容；截断或模糊项回到原 PDF 重截。",
        "stats": {
            "uniqueAssets": inventory["uniqueAssets"],
            "markdownReferences": inventory["markdownReferences"],
            "mappedToPdfPage": inventory["mappedToPdfPage"],
            "visuallyReviewed": len(finalized),
            "secondPassReviewed": sum(second_pass_counts.values()),
            "secondPassRecropped": second_pass_counts.get("recropped", 0),
            "secondPassRerenderedFromPdf": second_pass_counts.get("rerendered", 0),
            "finalCrossFixes": len(final_cross_fix_coverage),
            "passed": counts.get("pass", 0),
            "recropped": counts.get("recropped", 0),
            "rerenderedFromPdf": counts.get("rerendered", 0),
            "needsReview": counts.get("needs-root-review", 0),
        },
        "reports": report_summaries,
        "records": finalized,
        "passed": True,
    }
    FINAL_PATH.write_text(json.dumps(final, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(FINAL_PATH.relative_to(PROJECT_ROOT)).replace("\\", "/"), **final["stats"]}, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
