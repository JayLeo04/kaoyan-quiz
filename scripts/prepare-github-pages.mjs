import { readdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/kaoyan-quiz";
const outputDirectory = resolve("dist/client");
const escapedBasePath = basePath.slice(1).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const rootAttribute = new RegExp(`\\b(src|href)=(['\"])\\/(?!\\/|${escapedBasePath}(?:\\/|$))`, "gi");
// Vinext writes its hydration entry point and RSC payload asset paths inside
// inline scripts, where they are not covered by the href/src rewrite above.
const rootAssetString = /(['"])\/(assets\/)/g;

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.isFile() && entry.name.endsWith(".html") ? [path] : [];
  }));
  return nested.flat();
}

const files = await htmlFiles(outputDirectory);
await Promise.all(files.map(async (file) => {
  const html = await readFile(file, "utf8");
  const prefixed = html
    .replace(rootAttribute, `$1=$2${basePath}/`)
    .replace(rootAssetString, `$1${basePath}/$2`);
  if (prefixed !== html) await writeFile(file, prefixed);
}));

console.log(`Prepared ${files.length} HTML files for ${basePath}.`);
