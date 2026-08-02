#!/usr/bin/env python3
"""Merge validated chapter question indexes into one deterministic catalog."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from validate_exercise_json import DEFAULT_SCHEMA, validate_file


def natural_key(value: Any) -> tuple[Any, ...]:
    text = str(value)
    parts: list[Any] = []
    for part in text.replace("_", "-").split("-"):
        try:
            parts.append((0, int(part)))
        except ValueError:
            parts.append((1, part))
    return tuple(parts)


def chapter_key(chapter: dict[str, Any]) -> tuple[Any, ...]:
    part_order = {"part-1-questions": 0, "part-2-practice": 1, "part-3-answers": 2}
    return (part_order.get(chapter.get("part"), 9), natural_key(chapter.get("number", "")), chapter.get("id", ""))


def question_key(question: dict[str, Any], chapter_order: dict[str, int]) -> tuple[Any, ...]:
    return (chapter_order.get(question.get("chapterId", ""), 10_000), natural_key(question.get("number", "")), question.get("id", ""))


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", required=True, help="exercise-book root")
    parser.add_argument("--input", default="questions", help="directory containing chapter JSON files")
    parser.add_argument("--output", default="questions/index.json", help="catalog output path relative to root")
    parser.add_argument("--report", default="work/json-audits/catalog.json", help="audit report path relative to root")
    args = parser.parse_args(argv)

    root = Path(args.root).resolve()
    input_dir = (root / args.input).resolve()
    output_path = (root / args.output).resolve()
    report_path = (root / args.report).resolve()
    errors: list[dict[str, Any]] = []
    warnings: list[dict[str, Any]] = []
    ids: dict[str, str] = {}
    chapter_numbers: dict[tuple[str, str], str] = {}
    try:
        schema = load_json(DEFAULT_SCHEMA)
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        schema = None
        errors.append({"path": "schema", "code": "schema", "message": str(exc)})
    if not root.is_dir():
        errors.append({"path": "root", "code": "root", "message": f"root directory does not exist: {root}"})
    if not input_dir.is_dir():
        errors.append({"path": "input", "code": "input", "message": f"input directory does not exist: {input_dir}"})

    files = []
    if input_dir.is_dir():
        files = sorted(
            path for path in input_dir.rglob("*.json")
            if path.is_file()
            and path.resolve() != output_path
            and not path.name.startswith(("luna-audit", "review"))
            and path.name not in {"index.json", "catalog.json"}
        )
    if not files:
        errors.append({"path": "input", "code": "no-input", "message": "no chapter JSON files found"})

    chapters: list[dict[str, Any]] = []
    questions: list[dict[str, Any]] = []
    knowledge: dict[str, dict[str, Any]] = {}
    book: dict[str, Any] | None = None
    book_variants: list[dict[str, Any]] = []
    for file_path in files:
        file_errors: list[dict[str, Any]] = []
        file_warnings: list[dict[str, Any]] = []
        validate_file(file_path, root, file_errors, file_warnings, ids, chapter_numbers, schema)
        for item in file_errors:
            errors.append({**item, "file": file_path.relative_to(root).as_posix()})
        for item in file_warnings:
            warnings.append({**item, "file": file_path.relative_to(root).as_posix()})
        try:
            data = load_json(file_path)
        except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
            errors.append({"path": file_path.relative_to(root).as_posix(), "code": "json", "message": str(exc)})
            continue
        chapter_file = file_path.relative_to(root).as_posix()
        chapter_book = data.get("book")
        if book is None:
            book = chapter_book
            book_variants.append({"book": chapter_book, "files": [chapter_file]})
        elif chapter_book != book:
            # Chapter agents may preserve slightly different edition punctuation or
            # printing-year metadata. Keep the first metadata object as the catalog
            # canonical value, but retain every variant instead of discarding source
            # information or aborting the merge.
            variant = next((item for item in book_variants if item.get("book") == chapter_book), None)
            if variant is None:
                book_variants.append({"book": chapter_book, "files": [chapter_file]})
            else:
                variant.setdefault("files", []).append(chapter_file)
            warnings.append({"path": chapter_file, "code": "book-mismatch", "message": "chapter book metadata differs from the canonical catalog metadata; preserved in bookVariants"})
        chapter = data.get("chapter")
        if not isinstance(chapter, dict):
            continue
        chapter_id = chapter.get("id")
        chapter_record = {
            "id": chapter_id,
            "number": chapter.get("number"),
            "title": chapter.get("title"),
            "part": chapter.get("part"),
            "file": chapter_file,
            "questionMarkdown": chapter.get("questionMarkdown"),
            "answerMarkdown": chapter.get("answerMarkdown"),
            "pdfPages": chapter.get("pdfPages"),
            "bookPages": chapter.get("bookPages"),
            "questionCount": len(data.get("questions", [])) if isinstance(data.get("questions"), list) else 0,
        }
        chapters.append(chapter_record)
        if isinstance(data.get("questions"), list):
            questions.extend(data["questions"])
            for question in data["questions"]:
                if not isinstance(question, dict):
                    continue
                for point in question.get("knowledgePoints", []):
                    if not isinstance(point, dict) or not isinstance(point.get("id"), str):
                        continue
                    point_id = point["id"]
                    current = knowledge.setdefault(point_id, {
                        "id": point_id,
                        "title": point.get("title", ""),
                        "titles": [point.get("title", "")] if point.get("title") else [],
                        "relations": [],
                        "confidences": [],
                        "questionIds": [],
                    })
                    if point.get("title") and point.get("title") not in current["titles"]:
                        current["titles"].append(point["title"])
                        warnings.append({"path": point_id, "code": "knowledge-title-variant", "message": "same knowledge point ID has variant titles; all titles preserved in catalog"})
                    if point.get("relation") not in current["relations"]:
                        current["relations"].append(point.get("relation"))
                    if point.get("confidence") not in current["confidences"]:
                        current["confidences"].append(point.get("confidence"))
                    if question.get("id") not in current["questionIds"]:
                        current["questionIds"].append(question.get("id"))

    # The same chapter-level Markdown warning can be encountered once per
    # question because source backlinks share an index file. Keep the audit
    # actionable by emitting each identical warning only once.
    unique_warnings: list[dict[str, Any]] = []
    seen_warnings: set[tuple[Any, ...]] = set()
    for warning in warnings:
        key = tuple(warning.get(field) for field in ("path", "code", "message", "file"))
        if key not in seen_warnings:
            seen_warnings.add(key)
            unique_warnings.append(warning)
    warnings = unique_warnings

    if errors:
        report = {
            "schemaVersion": "luna-exercise-question-catalog-audit-1",
            "valid": False,
            "files": [path.relative_to(root).as_posix() for path in files],
            "stats": {"chapters": len(chapters), "questions": len(questions), "knowledgePoints": len(knowledge)},
            "errors": errors,
            "warnings": warnings,
        }
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 1

    chapters.sort(key=chapter_key)
    chapter_order = {chapter["id"]: index for index, chapter in enumerate(chapters)}
    questions.sort(key=lambda question: question_key(question, chapter_order))
    for point in knowledge.values():
        point["titles"] = sorted(set(point.get("titles", [])))
        point["relations"].sort()
        point["confidences"].sort()
        point["questionIds"].sort(key=lambda question_id: question_key(next((item for item in questions if item.get("id") == question_id), {"id": question_id}), chapter_order))
    catalog = {
        "schemaVersion": "luna-exercise-question-catalog-1",
        "sourceOfTruth": "markdown",
        "book": book,
        "bookVariants": book_variants,
        "chapters": chapters,
        "questions": questions,
        "knowledgePoints": sorted(knowledge.values(), key=lambda point: point["id"]),
        "stats": {
            "chapters": len(chapters),
            "questions": len(questions),
            "images": sum(len(question.get("images", [])) for question in questions if isinstance(question, dict)),
            "answersMissing": sum(1 for question in questions if question.get("answer", {}).get("status") == "missing"),
            "openReviewFlags": sum(
                1 for question in questions for flag in question.get("review", {}).get("flags", [])
                if flag.get("status") == "open"
            ),
        },
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    report = {
        "schemaVersion": "luna-exercise-question-catalog-audit-1",
        "valid": True,
        "output": output_path.relative_to(root).as_posix(),
        "files": [path.relative_to(root).as_posix() for path in files],
        "stats": catalog["stats"] | {"knowledgePoints": len(knowledge)},
        "errors": [],
        "warnings": warnings,
    }
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
