/** @type {import('next').NextConfig} */
const repo = "valentines-website";
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig = {
  // Static export for GitHub Pages
  output: "export",

  // GitHub Pages doesn't support Next's image optimization server.
  images: { unoptimized: true },

  // When deployed to https://<user>.github.io/<repo>/, Next needs a basePath.
  basePath: isGitHubPages ? `/${repo}` : "",
  assetPrefix: isGitHubPages ? `/${repo}/` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isGitHubPages ? `/${repo}` : "",
  },

  // Keeps URLs stable for static hosting.
  trailingSlash: true,
};

export default nextConfig;

