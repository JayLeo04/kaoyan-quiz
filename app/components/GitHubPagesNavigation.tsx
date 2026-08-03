"use client";

import { useEffect } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Keep client-side route clicks inside a project Pages site. */
export function GitHubPagesNavigation() {
  useEffect(() => {
    if (!basePath) return;

    const prefixRootRelativeAttribute = (element: Element, attribute: "href" | "src") => {
      const value = element.getAttribute(attribute);
      if (!value || !value.startsWith("/") || value.startsWith("//") || value === basePath || value.startsWith(`${basePath}/`)) return;
      element.setAttribute(attribute, `${basePath}${value}`);
    };

    const prefixRootRelativeTree = (root: ParentNode) => {
      if (root instanceof Element) {
        prefixRootRelativeAttribute(root, "href");
        prefixRootRelativeAttribute(root, "src");
      }
      root.querySelectorAll("[href], [src]").forEach((element) => {
        prefixRootRelativeAttribute(element, "href");
        prefixRootRelativeAttribute(element, "src");
      });
    };

    const keepInsidePagesSite = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a[href]");
      if (!link || link.target || link.hasAttribute("download")) return;
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//") || href === basePath || href.startsWith(`${basePath}/`)) return;
      event.preventDefault();
      window.location.assign(`${basePath}${href}`);
    };

    prefixRootRelativeTree(document);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes") prefixRootRelativeAttribute(record.target as Element, record.attributeName as "href" | "src");
        else record.addedNodes.forEach((node) => {
          if (node instanceof Element) prefixRootRelativeTree(node);
        });
      }
    });
    observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["href", "src"] });
    document.addEventListener("click", keepInsidePagesSite, true);
    return () => {
      observer.disconnect();
      document.removeEventListener("click", keepInsidePagesSite, true);
    };
  }, []);

  return null;
}
