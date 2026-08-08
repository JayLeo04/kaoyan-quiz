"use client";

import { useEffect, type RefObject } from "react";

type MermaidInstance = typeof import("mermaid").default;

let mermaidInstancePromise: Promise<MermaidInstance> | undefined;
let nextDiagramId = 0;

function loadMermaid() {
  if (!mermaidInstancePromise) {
    mermaidInstancePromise = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        // Mermaid input can come from a learner's local Markdown note. Keep the
        // renderer in its restrictive mode and avoid HTML labels in the SVG.
        securityLevel: "strict",
        theme: "base",
        fontFamily: '"Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
        themeVariables: {
          background: "#fbfaf6",
          primaryColor: "#efecff",
          primaryTextColor: "#242522",
          primaryBorderColor: "#7168b2",
          secondaryColor: "#eef7ef",
          tertiaryColor: "#fff5e8",
          lineColor: "#625b95",
          fontSize: "14px",
        },
        flowchart: { htmlLabels: false, useMaxWidth: true },
      });
      return mermaid;
    });
  }
  return mermaidInstancePromise;
}

function createDiagramShell() {
  const figure = document.createElement("figure");
  figure.className = "mermaid-diagram";
  figure.setAttribute("role", "img");
  figure.setAttribute("aria-label", "Mermaid 图示");

  const canvas = document.createElement("div");
  canvas.className = "mermaid-diagram-canvas";
  figure.append(canvas);
  return { figure, canvas };
}

function showRenderError(figure: HTMLElement) {
  figure.classList.add("is-error");
  const notice = document.createElement("p");
  notice.className = "mermaid-diagram-error";
  notice.textContent = "Mermaid 语法暂时无法渲染，已保留原代码供修改。";
  figure.append(notice);
}

/**
 * Turns fenced ```mermaid blocks that were emitted as HTML into safe SVGs.
 * The original code block remains available whenever Mermaid cannot parse it.
 */
export function MermaidCodeBlocks({
  rootRef,
  contentKey,
}: {
  rootRef: RefObject<HTMLElement | null>;
  contentKey: string;
}) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    async function renderAll() {
      const codeBlocks = Array.from(root.querySelectorAll<HTMLElement>("pre > code.language-mermaid"));
      if (!codeBlocks.length) return;
      const mermaid = await loadMermaid();

      for (const code of codeBlocks) {
        if (code.dataset.mermaidState) continue;
        const source = code.textContent?.trim();
        const pre = code.parentElement;
        if (!source || !pre) continue;

        code.dataset.mermaidState = "rendering";
        pre.classList.add("mermaid-source");
        const { figure, canvas } = createDiagramShell();
        pre.insertAdjacentElement("afterend", figure);

        try {
          const diagramId = `yanshua-mermaid-${nextDiagramId++}`;
          const { svg } = await mermaid.render(diagramId, source);
          canvas.innerHTML = svg;
          figure.dataset.state = "ready";
          code.dataset.mermaidState = "ready";
          pre.hidden = true;
          pre.setAttribute("aria-hidden", "true");
        } catch {
          code.dataset.mermaidState = "error";
          figure.dataset.state = "error";
          showRenderError(figure);
        }
      }
    }

    // Do not cancel this work during React Strict Mode's effect replay: the
    // first pass owns the marked nodes, and a later route change replaces them.
    void renderAll();
  }, [contentKey, rootRef]);

  return null;
}
