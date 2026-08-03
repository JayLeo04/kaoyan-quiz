"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

type SiteLinkProps = ComponentProps<typeof NextLink>;

/** Give the framework router the same project prefix as the rendered HTML. */
export default function SiteLink({ href, ...props }: SiteLinkProps) {
  const siteHref =
    basePath && typeof href === "string" && href.startsWith("/") && !href.startsWith("//") && href !== basePath && !href.startsWith(`${basePath}/`)
      ? `${basePath}${href}`
      : href;

  return <NextLink {...props} href={siteHref} />;
}
