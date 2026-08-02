#!/usr/bin/env python3
"""Validate chapter-level exercise-book JSON and its Markdown/image back-links.

This validator intentionally uses only the Python standard library.  The JSON
Schema next to it documents the interchange contract; this file adds the
cross-file and on-disk checks that JSON Schema cannot express (unique IDs,
source files, image dimensions, Markdown fences, and review gates).
"""

from __future__ import annotations

import argparse
import json
import re
import struct
import sys
from pathlib import Path
from typing import Any, Iterable

try:
    from jsonschema import Draft202012Validator
except ImportError:  # pragma: no cover - the manual checks remain usable offline.
    Draft202012Validator = None


SCRIPT_DIR = Path(__file__).resolve().parent
DEFAULT_SCHEMA = SCRIPT_DIR.parent / "references" / "exercise-json-schema.json"

TYPE_NAMES = {
    dict: "object",
    list: "array",
    str: "string",
    int: "integer",
    float: "number",
    bool: "boolean",
}


def issue(bucket: list[dict[str, Any]], path: str, message: str, *, code: str) -> None:
    bucket.append({"path": path or "$", "code": code, "message": message})


def is_int(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool)


def expect_type(value: Any, expected: type | tuple[type, ...], path: str, errors: list[dict[str, Any]]) -> bool:
    if isinstance(value, expected) and not (expected in (int, (int, float)) and isinstance(value, bool)):
        return True
    names = ", ".join(TYPE_NAMES.get(item, str(item)) for item in (expected if isinstance(expected, tuple) else (expected,)))
    issue(errors, path, f"expected {names}, got {type(value).__name__}", code="type")
    return False


def required(obj: dict[str, Any], names: Iterable[str], path: str, errors: list[dict[str, Any]]) -> None:
    for name in names:
        if name not in obj:
            issue(errors, f"{path}.{name}", "required field is missing", code="required")


def nonempty_string(value: Any, path: str, errors: list[dict[str, Any]], *, min_length: int = 1) -> bool:
    if not expect_type(value, str, path, errors):
        return False
    if len(value.strip()) < min_length:
        issue(errors, path, f"must contain at least {min_length} non-whitespace characters", code="empty")
        return False
    return True


def page_array(value: Any, path: str, errors: list[dict[str, Any]]) -> bool:
    if not expect_type(value, list, path, errors):
        return False
    if not value:
        issue(errors, path, "must not be empty", code="empty")
    for index, page in enumerate(value):
        if not is_int(page) or page < 1:
            issue(errors, f"{path}[{index}]", "must be a positive integer", code="page")
    return True


def relative_path(value: Any, path: str, errors: list[dict[str, Any]], suffix: str | None = None) -> bool:
    if not nonempty_string(value, path, errors):
        return False
    if Path(value).is_absolute() or re.match(r"^[A-Za-z]:", value) or "\\" in value or ".." in Path(value).parts or "://" in value:
        issue(errors, path, "must be a relative repository path", code="path")
    if suffix and not value.lower().endswith(suffix):
        issue(errors, path, f"must end with {suffix}", code="path")
    return True


def validate_source_backlink(value: Any, path: str, root: Path, errors: list[dict[str, Any]]) -> None:
    if value is None:
        return
    if not expect_type(value, dict, path, errors):
        return
    required(value, ("markdown", "anchor", "pdfPages", "bookPages"), path, errors)
    if "markdown" in value:
        relative_path(value["markdown"], f"{path}.markdown", errors, ".md")
        check_markdown_file(value["markdown"], f"{path}.markdown", root, errors, warnings=[])
    if "anchor" in value:
        nonempty_string(value["anchor"], f"{path}.anchor", errors)
        if isinstance(value["anchor"], str) and re.search(r"\s", value["anchor"]):
            issue(errors, f"{path}.anchor", "must be a stable anchor without whitespace", code="anchor")
    for key in ("pdfPages", "bookPages"):
        if key in value:
            page_array(value[key], f"{path}.{key}", errors)
    if "lineStart" in value and (not is_int(value["lineStart"]) or value["lineStart"] < 1):
        issue(errors, f"{path}.lineStart", "must be a positive integer", code="line")
    if "lineEnd" in value and (not is_int(value["lineEnd"]) or value["lineEnd"] < 1):
        issue(errors, f"{path}.lineEnd", "must be a positive integer", code="line")
    if is_int(value.get("lineStart")) and is_int(value.get("lineEnd")) and value["lineEnd"] < value["lineStart"]:
        issue(errors, path, "lineEnd must not precede lineStart", code="line")


def resolve_inside(root: Path, relative: str) -> Path | None:
    try:
        candidate = (root / relative).resolve()
        candidate.relative_to(root.resolve())
    except (OSError, ValueError):
        return None
    return candidate


def check_markdown_file(relative: Any, path: str, root: Path, errors: list[dict[str, Any]], warnings: list[dict[str, Any]]) -> str | None:
    if not isinstance(relative, str):
        return None
    file_path = resolve_inside(root, relative)
    if file_path is None or not file_path.is_file():
        issue(errors, path, f"Markdown file does not exist under root: {relative}", code="missing-source")
        return None
    try:
        content = file_path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        issue(errors, path, f"Markdown is not valid UTF-8: {exc}", code="encoding")
        return None
    if "\ufffd" in content:
        issue(errors, path, "Markdown contains the Unicode replacement character; source fidelity is unknown", code="replacement-char")
    if not re.search(r"<!--\s*luna:source\b", content):
        issue(errors, path, "Markdown must contain a luna:source comment", code="source-comment")
    if len(re.findall(r"^\s*```", content, flags=re.MULTILINE)) % 2:
        issue(errors, path, "Markdown has an unclosed fenced code block", code="fence")
    image_pattern = re.compile(r"!\[([^\]]*)\]\(([^)\s]+)(?:\s+[^)]*)?\)")
    for index, match in enumerate(image_pattern.finditer(content)):
        alt, image_path = match.groups()
        image_path = image_path.replace("\\", "/")
        if not alt.strip():
            issue(errors, f"{path}.image[{index}]", "image alt text must describe the figure", code="image-alt")
        if image_path.startswith(("http://", "https://", "data:")) or image_path.startswith("page-"):
            issue(errors, f"{path}.image[{index}]", "external, page-raster, or data URLs are not allowed", code="image-source")
        if image_path.startswith("assets/py/"):
            image_file = resolve_inside(root, image_path)
            if image_file is None or not image_file.is_file():
                issue(errors, f"{path}.image[{index}]", f"image file does not exist: {image_path}", code="missing-image")
    if "luna:review" in content:
        warnings.append({"path": path, "code": "review-marker", "message": "Markdown still contains a luna:review marker"})
    headings = [len(match.group(1)) for match in re.finditer(r"^(#{1,6})\s+", content, flags=re.MULTILINE)]
    for index in range(1, len(headings)):
        if headings[index] - headings[index - 1] > 1:
            issue(errors, f"{path}.heading[{index}]", "heading levels skip a level", code="heading-level")
    return content


def png_dimensions(path: Path) -> tuple[int, int] | None:
    try:
        with path.open("rb") as handle:
            if handle.read(8) != b"\x89PNG\r\n\x1a\n":
                return None
            length = struct.unpack(">I", handle.read(4))[0]
            chunk = handle.read(4)
            if chunk != b"IHDR" or length < 8:
                return None
            width, height = struct.unpack(">II", handle.read(8))
            return width, height
    except (OSError, struct.error):
        return None


def svg_viewbox(path: Path) -> tuple[float, float] | None:
    try:
        text = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return None
    match = re.search(r"<svg\b[^>]*\bviewBox\s*=\s*[\"']\s*[-+0-9.eE]+\s+[-+0-9.eE]+\s+([-+0-9.eE]+)\s+([-+0-9.eE]+)", text)
    if not match:
        return None
    return float(match.group(1)), float(match.group(2))


def validate_image(value: Any, path: str, root: Path, errors: list[dict[str, Any]]) -> str | None:
    if not expect_type(value, dict, path, errors):
        return None
    required(value, ("id", "path", "alt", "role", "sourcePdfPages", "quality"), path, errors)
    for key in ("id", "path", "alt", "role"):
        if key in value:
            nonempty_string(value[key], f"{path}.{key}", errors)
    if "sourcePdfPages" in value:
        page_array(value["sourcePdfPages"], f"{path}.sourcePdfPages", errors)
    image_path = value.get("path")
    if not isinstance(image_path, str):
        return None
    image_path = image_path.replace("\\", "/")
    if not image_path.startswith("assets/py/") or image_path.lower().endswith((".jpg", ".jpeg")) or "page-" in image_path.lower() or "screenshot" in image_path.lower() or "base64" in image_path.lower():
        issue(errors, f"{path}.path", "images must be local Python-rendered SVG/PNG assets, not screenshots or external files", code="image-path")
    file_path = resolve_inside(root, image_path)
    if file_path is None or not file_path.is_file():
        issue(errors, f"{path}.path", f"image file does not exist: {image_path}", code="missing-image")
        return image_path
    quality = value.get("quality")
    if not expect_type(quality, dict, f"{path}.quality", errors):
        return image_path
    required(quality, ("generatedBy", "format", "width", "height", "verified"), f"{path}.quality", errors)
    if quality.get("generatedBy") != "python":
        issue(errors, f"{path}.quality.generatedBy", "must be python", code="image-quality")
    expected_format = "svg" if file_path.suffix.lower() == ".svg" else "png" if file_path.suffix.lower() == ".png" else None
    if quality.get("format") != expected_format:
        issue(errors, f"{path}.quality.format", f"must match the file extension ({expected_format})", code="image-quality")
    for key, minimum in (("width", 1200), ("height", 800)):
        if not is_int(quality.get(key)) or quality[key] < minimum:
            issue(errors, f"{path}.quality.{key}", f"must be an integer >= {minimum}", code="image-quality")
    if quality.get("verified") is not True:
        issue(errors, f"{path}.quality.verified", "must be true after visual inspection", code="image-quality")
    actual = png_dimensions(file_path) if expected_format == "png" else svg_viewbox(file_path) if expected_format == "svg" else None
    if actual is None:
        issue(errors, f"{path}.path", "image format or SVG viewBox could not be inspected", code="image-format")
    elif actual[0] < 600 or actual[1] < 400:
        issue(errors, f"{path}.path", "rendered image viewBox/dimensions are too small for a high-quality figure", code="image-resolution")
    return image_path


def validate_question(value: Any, path: str, root: Path, expected_chapter: str, errors: list[dict[str, Any]], warnings: list[dict[str, Any]]) -> None:
    if not expect_type(value, dict, path, errors):
        return
    required(value, ("id", "number", "type", "chapterId", "section", "prompt", "options", "answer", "knowledgePoints", "images", "source", "review"), path, errors)
    for key in ("id", "number", "type", "chapterId"):
        if key in value:
            nonempty_string(value[key], f"{path}.{key}", errors)
    if value.get("chapterId") != expected_chapter:
        issue(errors, f"{path}.chapterId", f"must equal chapter.id ({expected_chapter})", code="chapter-mismatch")
    section = value.get("section")
    if not expect_type(section, dict, f"{path}.section", errors):
        section = {}
    else:
        required(section, ("id", "title", "path"), f"{path}.section", errors)
        for key in ("id", "title"):
            if key in section:
                nonempty_string(section[key], f"{path}.section.{key}", errors)
        if "path" in section:
            if not expect_type(section["path"], list, f"{path}.section.path", errors):
                pass
            elif not section["path"]:
                issue(errors, f"{path}.section.path", "must contain at least one heading", code="section")
    prompt = value.get("prompt")
    if not expect_type(prompt, dict, f"{path}.prompt", errors):
        prompt = {}
    elif "markdown" not in prompt:
        issue(errors, f"{path}.prompt.markdown", "full prompt Markdown is required", code="prompt")
    else:
        nonempty_string(prompt["markdown"], f"{path}.prompt.markdown", errors)
    options = value.get("options")
    if expect_type(options, list, f"{path}.options", errors):
        labels: set[str] = set()
        for index, option in enumerate(options):
            option_path = f"{path}.options[{index}]"
            if not expect_type(option, dict, option_path, errors):
                continue
            required(option, ("label", "markdown"), option_path, errors)
            label = option.get("label")
            if isinstance(label, str):
                if label in labels:
                    issue(errors, f"{option_path}.label", "option labels must be unique", code="duplicate-option")
                labels.add(label)
            else:
                nonempty_string(label, f"{option_path}.label", errors)
            if "markdown" in option:
                nonempty_string(option["markdown"], f"{option_path}.markdown", errors)
    answer = value.get("answer")
    if expect_type(answer, dict, f"{path}.answer", errors):
        required(answer, ("status", "origin", "original"), f"{path}.answer", errors)
        status, origin = answer.get("status"), answer.get("origin")
        if status not in {"provided", "hint-only", "missing", "pending-review"}:
            issue(errors, f"{path}.answer.status", "invalid answer status", code="answer-status")
        if origin not in {"book", "verified", "book+verified", "missing"}:
            issue(errors, f"{path}.answer.origin", "invalid answer origin", code="answer-origin")
        original = answer.get("original")
        if not isinstance(original, str):
            nonempty_string(original, f"{path}.answer.original", errors)
        elif status in {"provided", "hint-only", "pending-review"} and not original.strip():
            issue(errors, f"{path}.answer.original", "provided/hint-only/pending answers must preserve original Markdown", code="answer-loss")
        elif status == "missing" and original.strip():
            issue(errors, f"{path}.answer.original", "missing answers must not invent original content", code="answer-loss")
        if origin == "missing" and status != "missing":
            issue(errors, f"{path}.answer.origin", "origin=missing is only valid with status=missing", code="answer-origin")
        if origin in {"verified", "book+verified"} and not isinstance(answer.get("verified"), str):
            issue(errors, f"{path}.answer.verified", "verified origin requires a separate verified Markdown field", code="answer-verification")
        source = value.get("source", {})
        answer_source = source.get("answer") if isinstance(source, dict) else None
        if status in {"provided", "hint-only", "pending-review"} and answer_source is None:
            issue(errors, f"{path}.source.answer", "answer source backlink is required when an answer exists", code="answer-source")
    points = value.get("knowledgePoints")
    if expect_type(points, list, f"{path}.knowledgePoints", errors):
        if not points:
            issue(errors, f"{path}.knowledgePoints", "at least one stable knowledge point is required", code="knowledge")
        seen: set[str] = set()
        for index, point in enumerate(points):
            point_path = f"{path}.knowledgePoints[{index}]"
            if not expect_type(point, dict, point_path, errors):
                continue
            required(point, ("id", "title", "relation", "confidence"), point_path, errors)
            point_id = point.get("id")
            if isinstance(point_id, str):
                if point_id in seen:
                    issue(errors, f"{point_path}.id", "knowledge point IDs must be unique", code="duplicate-knowledge")
                seen.add(point_id)
            else:
                nonempty_string(point_id, f"{point_path}.id", errors)
            for key in ("title", "relation", "confidence"):
                if key in point:
                    nonempty_string(point[key], f"{point_path}.{key}", errors)
            if point.get("confidence") == "pending-review" and value.get("review", {}).get("status") == "passed":
                issue(errors, point_path, "pending-review knowledge point cannot be in a passed record", code="review-gate")
    images = value.get("images")
    image_paths: set[str] = set()
    if expect_type(images, list, f"{path}.images", errors):
        for index, image in enumerate(images):
            image_path = validate_image(image, f"{path}.images[{index}]", root, errors)
            if image_path:
                if image_path in image_paths:
                    issue(errors, f"{path}.images[{index}].path", "image paths must be unique per question", code="duplicate-image")
                image_paths.add(image_path)
    source = value.get("source")
    if expect_type(source, dict, f"{path}.source", errors):
        required(source, ("question", "answer"), f"{path}.source", errors)
        validate_source_backlink(source.get("question"), f"{path}.source.question", root, errors)
        validate_source_backlink(source.get("answer"), f"{path}.source.answer", root, errors)
    review = value.get("review")
    if expect_type(review, dict, f"{path}.review", errors):
        required(review, ("status", "flags"), f"{path}.review", errors)
        status = review.get("status")
        flags = review.get("flags")
        if status not in {"passed", "pending", "needs-review"}:
            issue(errors, f"{path}.review.status", "invalid review status", code="review-status")
        if expect_type(flags, list, f"{path}.review.flags", errors):
            open_flags = 0
            for index, flag in enumerate(flags):
                flag_path = f"{path}.review.flags[{index}]"
                if not expect_type(flag, dict, flag_path, errors):
                    continue
                required(flag, ("code", "message", "severity", "status"), flag_path, errors)
                for key in ("code", "message", "severity", "status"):
                    if key in flag:
                        nonempty_string(flag[key], f"{flag_path}.{key}", errors)
                if flag.get("status") == "open":
                    open_flags += 1
                if "pdfPages" in flag:
                    page_array(flag["pdfPages"], f"{flag_path}.pdfPages", errors)
            if status == "passed" and open_flags:
                issue(errors, f"{path}.review", "passed records cannot contain open review flags", code="review-gate")
    markdown_paths = [source.get("question", {}).get("markdown")] if isinstance(source, dict) and isinstance(source.get("question"), dict) else []
    if isinstance(source, dict) and isinstance(source.get("answer"), dict):
        markdown_paths.append(source["answer"].get("markdown"))
    for markdown_path in markdown_paths:
        content = check_markdown_file(markdown_path, f"{path}.source", root, errors, warnings)
        if content is None:
            continue
        if isinstance(review, dict) and review.get("status") == "passed" and "luna:review" in content:
            issue(errors, f"{path}.review", f"passed record still has a luna:review marker in {markdown_path}", code="review-marker")
        for match in re.finditer(r"!\[[^\]]*\]\((assets/py/[^)\s]+)", content):
            if match.group(1) not in image_paths:
                issue(errors, f"{path}.images", f"Markdown image is not represented in JSON images: {match.group(1)}", code="image-backlink")


def schema_path(error: Any) -> str:
    parts = [str(item) if not isinstance(item, int) else f"[{item}]" for item in error.absolute_path]
    output = "$"
    for part in parts:
        output += part if part.startswith("[") else f".{part}"
    return output


def validate_against_schema(data: Any, schema: dict[str, Any] | None, path: str, errors: list[dict[str, Any]], warnings: list[dict[str, Any]]) -> None:
    if schema is None:
        return
    if Draft202012Validator is None:
        warnings.append({"path": path, "code": "schema-engine-unavailable", "message": "jsonschema is not installed; manual cross-file checks were used"})
        return
    validator = Draft202012Validator(schema)
    for validation_error in sorted(validator.iter_errors(data), key=lambda item: list(item.absolute_path)):
        issue(errors, f"{path}{schema_path(validation_error)[1:]}", validation_error.message, code="schema")


def validate_file(file_path: Path, root: Path, errors: list[dict[str, Any]], warnings: list[dict[str, Any]], ids: dict[str, str], chapter_numbers: dict[tuple[str, str], str], schema: dict[str, Any] | None = None) -> int:
    try:
        data = json.loads(file_path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        issue(errors, str(file_path), "file does not exist", code="missing-file")
        return 0
    except UnicodeDecodeError as exc:
        issue(errors, str(file_path), f"JSON is not valid UTF-8: {exc}", code="encoding")
        return 0
    except json.JSONDecodeError as exc:
        issue(errors, str(file_path), f"invalid JSON: {exc}", code="json")
        return 0
    path = file_path.relative_to(root).as_posix()
    validate_against_schema(data, schema, path, errors, warnings)
    if not expect_type(data, dict, path, errors):
        return 0
    required(data, ("schemaVersion", "book", "chapter", "source", "questions"), path, errors)
    if data.get("schemaVersion") != "luna-exercise-question-1":
        issue(errors, f"{path}.schemaVersion", "unsupported schema version", code="schema-version")
    book = data.get("book")
    if expect_type(book, dict, f"{path}.book", errors):
        required(book, ("id", "title", "mode"), f"{path}.book", errors)
        if book.get("mode") != "exercise-book":
            issue(errors, f"{path}.book.mode", "must be exercise-book", code="mode")
    chapter = data.get("chapter")
    chapter_id = chapter.get("id") if isinstance(chapter, dict) else None
    if expect_type(chapter, dict, f"{path}.chapter", errors):
        required(chapter, ("id", "number", "title", "part", "questionMarkdown"), f"{path}.chapter", errors)
        for key in ("id", "number", "title", "part"):
            if key in chapter:
                nonempty_string(chapter[key], f"{path}.chapter.{key}", errors)
        if "questionMarkdown" in chapter:
            relative_path(chapter["questionMarkdown"], f"{path}.chapter.questionMarkdown", errors, ".md")
            check_markdown_file(chapter["questionMarkdown"], f"{path}.chapter.questionMarkdown", root, errors, warnings)
        if chapter.get("answerMarkdown") is not None:
            relative_path(chapter["answerMarkdown"], f"{path}.chapter.answerMarkdown", errors, ".md")
            check_markdown_file(chapter["answerMarkdown"], f"{path}.chapter.answerMarkdown", root, errors, warnings)
    if "source" in data and expect_type(data["source"], dict, f"{path}.source", errors):
        required(data["source"], ("pdfPages", "bookPages"), f"{path}.source", errors)
        for key in ("pdfPages", "bookPages"):
            if key in data["source"]:
                page_array(data["source"][key], f"{path}.source.{key}", errors)
    questions = data.get("questions")
    count = 0
    if expect_type(questions, list, f"{path}.questions", errors):
        if not questions:
            issue(warnings, f"{path}.questions", "chapter contains no question records", code="empty-chapter")
        for index, question in enumerate(questions):
            qpath = f"{path}.questions[{index}]"
            validate_question(question, qpath, root, chapter_id or "", errors, warnings)
            if not isinstance(question, dict):
                continue
            count += 1
            question_id = question.get("id")
            if isinstance(question_id, str):
                if question_id in ids:
                    issue(errors, qpath, f"duplicate question ID; already defined in {ids[question_id]}", code="duplicate-id")
                else:
                    ids[question_id] = f"{path}.questions[{index}]"
            number = question.get("number")
            if isinstance(chapter_id, str) and isinstance(number, str):
                key = chapter_id, number
                if key in chapter_numbers:
                    issue(errors, qpath, f"duplicate question number; already defined in {chapter_numbers[key]}", code="duplicate-number")
                else:
                    chapter_numbers[key] = f"{path}.questions[{index}]"
    return count


def collect_files(root: Path, input_path: str | None) -> list[Path]:
    target = (root / input_path).resolve() if input_path else (root / "questions").resolve()
    if target.is_file():
        return [target]
    if not target.is_dir():
        return []
    return sorted(path for path in target.rglob("*.json") if path.is_file() and not path.name.startswith(("luna-audit", "review")))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", required=True, help="exercise-book root containing Markdown and assets")
    parser.add_argument("--input", help="one JSON file or a directory; defaults to <root>/questions")
    parser.add_argument("--schema", default=str(DEFAULT_SCHEMA), help="JSON Schema contract to load")
    parser.add_argument("--report", help="write a JSON audit report")
    args = parser.parse_args(argv)

    root = Path(args.root).resolve()
    schema_path = Path(args.schema).resolve()
    errors: list[dict[str, Any]] = []
    warnings: list[dict[str, Any]] = []
    if not root.is_dir():
        issue(errors, "root", f"root directory does not exist: {root}", code="root")
    schema_data: dict[str, Any] | None = None
    try:
        schema_data = json.loads(schema_path.read_text(encoding="utf-8"))
    except (OSError, UnicodeDecodeError, json.JSONDecodeError) as exc:
        issue(errors, "schema", f"cannot load JSON Schema {schema_path}: {exc}", code="schema")
    files = collect_files(root, args.input) if root.is_dir() else []
    if not files:
        issue(errors, "input", "no chapter question JSON files found", code="no-input")
    ids: dict[str, str] = {}
    chapter_numbers: dict[tuple[str, str], str] = {}
    question_count = 0
    for file_path in files:
        question_count += validate_file(file_path, root, errors, warnings, ids, chapter_numbers, schema_data)
    report = {
        "schemaVersion": "luna-exercise-question-audit-1",
        "root": root.as_posix(),
        "valid": not errors,
        "files": [path.relative_to(root).as_posix() for path in files],
        "stats": {"files": len(files), "questions": question_count, "errors": len(errors), "warnings": len(warnings)},
        "errors": errors,
        "warnings": warnings,
    }
    if args.report:
        report_path = Path(args.report)
        if not report_path.is_absolute():
            report_path = root / report_path
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    sys.exit(main())
