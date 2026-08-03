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
    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
