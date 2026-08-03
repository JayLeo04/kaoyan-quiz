import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const gitHubPagesBasePath = process.env.GITHUB_PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(isGitHubPagesBuild
    ? {
        output: "export",
        basePath: gitHubPagesBasePath,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
