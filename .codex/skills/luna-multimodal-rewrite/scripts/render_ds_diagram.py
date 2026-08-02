#!/usr/bin/env python3
"""Deterministically redraw common data-structure diagrams from JSON."""

from __future__ import annotations

import argparse
import json
import math
import sys
from pathlib import Path
from typing import Any


def load_matplotlib():
    try:
        import matplotlib

        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        from matplotlib.patches import Circle, FancyArrowPatch, Rectangle
    except ImportError as exc:  # pragma: no cover - environment dependent
        raise RuntimeError("matplotlib is required for Python diagram redraws") from exc
    return plt, Circle, FancyArrowPatch, Rectangle


def text_value(value: Any) -> str:
    if isinstance(value, dict):
        return str(value.get("label", value.get("value", "")))
    return str(value)


def setup_figure(plt, spec: dict[str, Any]):
    plt.rcParams["axes.unicode_minus"] = False
    plt.rcParams["font.sans-serif"] = [
        spec.get("font", "Microsoft YaHei"),
        "SimHei",
        "Noto Sans CJK SC",
        "DejaVu Sans",
    ]
    width = float(spec.get("width", 10))
    height = float(spec.get("height", 3.8))
    fig, ax = plt.subplots(figsize=(width, height), dpi=int(spec.get("dpi", 160)))
    fig.patch.set_facecolor("white")
    ax.set_facecolor("white")
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1)
    ax.axis("off")
    title = str(spec.get("title", "")).strip()
    if title:
        ax.text(0.5, 0.96, title, ha="center", va="top", fontsize=14, fontweight="bold")
    return fig, ax


def draw_array(ax, spec, Rectangle):
    items = spec.get("items", [])
    if not items:
        raise ValueError("array diagram requires non-empty items")
    left, width = 0.06, 0.88 / len(items)
    highlighted = {str(item) for item in spec.get("highlight", [])}
    for index, item in enumerate(items):
        label = text_value(item)
        x = left + index * width
        is_highlighted = str(index) in highlighted or label in highlighted
        ax.add_patch(
            Rectangle(
                (x, 0.40), width, 0.22,
                facecolor="#e9e6ff" if is_highlighted else "#f7f7fa",
                edgecolor="#4d4d5c", linewidth=1.2,
            )
        )
        ax.text(x + width / 2, 0.68, str(index), ha="center", va="center", fontsize=10, color="#555")
        ax.text(x + width / 2, 0.51, label, ha="center", va="center", fontsize=11)


def draw_linked_list(ax, spec, Rectangle, FancyArrowPatch):
    items = spec.get("items", [])
    if not items:
        raise ValueError("linked-list diagram requires non-empty items")
    left, node_width, gap = 0.05, min(0.16, 0.78 / len(items)), 0.025
    y = 0.44
    positions = []
    for index, item in enumerate(items):
        x = left + index * (node_width + gap)
        positions.append((x, y))
        ax.add_patch(Rectangle((x, y), node_width * 0.72, 0.16, facecolor="#f7f7fa", edgecolor="#4d4d5c", linewidth=1.2))
        ax.add_patch(Rectangle((x + node_width * 0.72, y), node_width * 0.28, 0.16, facecolor="#e9e6ff", edgecolor="#4d4d5c", linewidth=1.2))
        ax.text(x + node_width * 0.36, y + 0.08, text_value(item), ha="center", va="center", fontsize=10)
        ax.text(x + node_width * 0.86, y + 0.08, "next", ha="center", va="center", fontsize=7, color="#555")
    for (x1, _), (x2, _) in zip(positions, positions[1:]):
        ax.add_patch(FancyArrowPatch((x1 + node_width, y + 0.08), (x2 - 0.005, y + 0.08), arrowstyle="-|>", mutation_scale=12, linewidth=1.2, color="#4d4d5c"))
    if positions:
        ax.text(positions[0][0], 0.30, "head", ha="left", va="center", fontsize=10, color="#5d50bd")


def node_positions(nodes, edges, circular=False):
    ids = [str(node.get("id", index)) for index, node in enumerate(nodes)]
    by_id = {node_id: node for node_id, node in zip(ids, nodes)}
    positions = {}
    for node_id, node in by_id.items():
        if "x" in node and "y" in node:
            positions[node_id] = (float(node["x"]), float(node["y"]))
    missing = [node_id for node_id in ids if node_id not in positions]
    if missing and not circular:
        children: dict[str, list[str]] = {node_id: [] for node_id in ids}
        child_ids = set()
        for edge in edges:
            source, target = str(edge["from"]), str(edge["to"])
            if source in children and target in by_id:
                children[source].append(target)
                child_ids.add(target)
        roots = [node_id for node_id in ids if node_id not in child_ids] or ids[:1]
        levels: dict[str, int] = {}
        queue = [(root, 0) for root in roots]
        while queue:
            current, level = queue.pop(0)
            if current in levels and levels[current] <= level:
                continue
            levels[current] = level
            queue.extend((child, level + 1) for child in children.get(current, []))
        for node_id in missing:
            levels.setdefault(node_id, 0)
        max_level = max(levels.values(), default=0)
        for level in range(max_level + 1):
            row = [node_id for node_id in missing if levels[node_id] == level]
            for index, node_id in enumerate(row):
                positions[node_id] = ((index + 1) / (len(row) + 1), 0.80 - level * 0.22)
    if missing and circular:
        for index, node_id in enumerate(missing):
            angle = math.pi / 2 - (2 * math.pi * index / max(1, len(missing)))
            positions[node_id] = (0.5 + 0.34 * math.cos(angle), 0.50 + 0.34 * math.sin(angle))
    return ids, by_id, positions


def draw_nodes(ax, spec, Circle, FancyArrowPatch, circular=False):
    nodes = spec.get("nodes", [])
    edges = spec.get("edges", [])
    if not nodes:
        raise ValueError(f"{spec.get('type')} diagram requires nodes")
    ids, by_id, positions = node_positions(nodes, edges, circular=circular)
    for edge in edges:
        source, target = str(edge["from"]), str(edge["to"])
        if source not in positions or target not in positions:
            raise ValueError(f"edge refers to unknown node: {source}->{target}")
        ax.add_patch(FancyArrowPatch(positions[source], positions[target], arrowstyle="-|>" if spec.get("directed", spec.get("type") == "flow") else "-", mutation_scale=12, linewidth=1.1, color="#6b6a78", shrinkA=14, shrinkB=14))
        if edge.get("label"):
            sx, sy = positions[source]
            tx, ty = positions[target]
            ax.text((sx + tx) / 2, (sy + ty) / 2 + 0.035, str(edge["label"]), ha="center", va="center", fontsize=8, color="#555")
    highlighted = {str(item) for item in spec.get("highlight", [])}
    for node_id in ids:
        x, y = positions[node_id]
        node = by_id[node_id]
        ax.add_patch(Circle((x, y), 0.045, facecolor="#e9e6ff" if node_id in highlighted else "#f7f7fa", edgecolor="#4d4d5c", linewidth=1.2))
        ax.text(x, y, text_value(node), ha="center", va="center", fontsize=10)
    return positions


def draw_sort_trace(ax, spec, Rectangle):
    states = spec.get("states", [])
    if not states:
        raise ValueError("sort-trace diagram requires states")
    max_items = max(len(state) for state in states)
    left, top, width, height = 0.08, 0.82, 0.80 / max_items, min(0.11, 0.65 / len(states))
    for row, state in enumerate(states):
        y = top - row * (height + 0.025)
        ax.text(0.02, y + height / 2, str(spec.get("labels", [f"step {row}"] * len(states))[row]), ha="left", va="center", fontsize=9, color="#555")
        for column, item in enumerate(state):
            x = left + column * width
            ax.add_patch(Rectangle((x, y), width, height, facecolor="#e9e6ff" if column in spec.get("highlight", []) else "#f7f7fa", edgecolor="#4d4d5c", linewidth=1.0))
            ax.text(x + width / 2, y + height / 2, text_value(item), ha="center", va="center", fontsize=9)


def draw_memory_layout(ax, spec, Rectangle):
    segments = spec.get("segments", [])
    if not segments:
        raise ValueError("memory-layout diagram requires segments")
    minimum = min(float(segment.get("start", 0)) for segment in segments)
    maximum = max(float(segment.get("end", segment.get("start", 0) + 1)) for segment in segments)
    span = max(1.0, maximum - minimum)
    for index, segment in enumerate(segments):
        start = float(segment.get("start", minimum))
        end = float(segment.get("end", start + 1))
        x, width = 0.08 + 0.84 * (start - minimum) / span, 0.84 * (end - start) / span
        y = 0.72 - (index % 2) * 0.24
        ax.add_patch(Rectangle((x, y), max(width, 0.02), 0.14, facecolor=segment.get("color", "#e9e6ff"), edgecolor="#4d4d5c", linewidth=1.1))
        ax.text(x + max(width, 0.02) / 2, y + 0.07, str(segment.get("label", "")), ha="center", va="center", fontsize=9)
        ax.text(x, y - 0.045, str(segment.get("start", "")), ha="center", va="top", fontsize=8, color="#555")
        ax.text(x + max(width, 0.02), y - 0.045, str(segment.get("end", "")), ha="center", va="top", fontsize=8, color="#555")


def render(spec: dict[str, Any], output: Path) -> None:
    plt, Circle, FancyArrowPatch, Rectangle = load_matplotlib()
    diagram_type = spec.get("type")
    fig, ax = setup_figure(plt, spec)
    if diagram_type == "array":
        draw_array(ax, spec, Rectangle)
    elif diagram_type == "linked-list":
        draw_linked_list(ax, spec, Rectangle, FancyArrowPatch)
    elif diagram_type == "tree":
        draw_nodes(ax, spec, Circle, FancyArrowPatch)
    elif diagram_type == "graph":
        draw_nodes(ax, spec, Circle, FancyArrowPatch, circular=True)
    elif diagram_type == "flow":
        draw_nodes(ax, spec, Circle, FancyArrowPatch)
    elif diagram_type == "sort-trace":
        draw_sort_trace(ax, spec, Rectangle)
    elif diagram_type == "memory-layout":
        draw_memory_layout(ax, spec, Rectangle)
    else:
        raise ValueError(f"unsupported diagram type: {diagram_type}")
    output.parent.mkdir(parents=True, exist_ok=True)
    suffix = output.suffix.lower().lstrip(".") or "svg"
    if suffix not in {"svg", "png", "pdf"}:
        raise ValueError("output extension must be .svg, .png, or .pdf")
    metadata = {"Creator": "LUNA Python redraw", "Title": str(spec.get("title", ""))}
    fig.savefig(output, format=suffix, bbox_inches="tight", facecolor="white", metadata=metadata)
    plt.close(fig)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--spec", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    if not args.spec.is_file():
        parser.error(f"spec not found: {args.spec}")
    try:
        spec = json.loads(args.spec.read_text(encoding="utf-8"))
        if not isinstance(spec, dict):
            raise ValueError("spec root must be a JSON object")
        render(spec, args.output)
        print(f"Rendered {spec.get('id', 'diagram')} -> {args.output}")
        return 0
    except (OSError, json.JSONDecodeError, RuntimeError, ValueError) as exc:
        print(f"render_ds_diagram.py: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
