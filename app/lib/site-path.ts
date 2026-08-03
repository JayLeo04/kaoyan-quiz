const siteBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function siteAssetPath(path: string) {
  if (!siteBasePath || !path.startsWith("/")) return path;
  return `${siteBasePath}${path}`;
}

/** Prefix root-relative assets embedded in the imported HTML fragments. */
export function withSiteAssetPaths(html: string) {
  if (!siteBasePath) return html;
  return html.replace(/\b(src|href)=(['"])\/(?!\/)/gi, `$1=$2${siteBasePath}/`);
}
