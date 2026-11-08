/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  turbopack: {
    resolveAlias: {
      "monaco-editor/esm/vs/editor/editor.api":
        "monaco-editor/editor/editor.api.js",
      "monaco-editor/esm/vs/editor/common/commands/shiftCommand":
        "monaco-editor/editor/common/commands/shiftCommand.js",
    },
  },
};

export default nextConfig;
