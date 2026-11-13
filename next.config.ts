import type { NextConfig } from "next";

const buildDate = new Date().toISOString().slice(0, 10);
const commit = (process.env.GITHUB_SHA ?? "local").slice(0, 7);

// GitHub Pages: a user site (kshitijlabs.github.io) is served from "/",
// a project site (kshitijlabs.github.io/<repo>) from "/<repo>".
// The deploy workflow passes the right value; locally it is empty.
const basePath = (process.env.PAGES_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BUILD_DATE: buildDate,
    NEXT_PUBLIC_COMMIT_SHA: commit,
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
