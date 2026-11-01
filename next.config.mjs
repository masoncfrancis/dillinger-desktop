/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  turbopack: {
    root: process.cwd(),
  },
  // Optimize barrel file imports for better tree-shaking.
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Keep native Chromium dependencies outside the server bundle.
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
};

if (process.env.NEXT_DESKTOP_BUILD === "1") {
  nextConfig.outputFileTracingExcludes = {
    "*": [
      "node_modules/@sparticuz/chromium/**",
      "node_modules/puppeteer-core/**",
      "node_modules/@puppeteer/**",
    ],
  };
}

export default nextConfig;
