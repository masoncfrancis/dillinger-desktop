const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(path.join(standalone, "server.js"))) {
  throw new Error("Next standalone output is missing. Run next build first.");
}

fs.cpSync(path.join(root, ".next", "static"), path.join(standalone, ".next", "static"), {
  recursive: true,
});
fs.cpSync(path.join(root, "public"), path.join(standalone, "public"), {
  recursive: true,
});

// Next's desktop tracing exclusions can leave empty external-package paths
// under .next/node_modules, which causes 7-Zip to fail during NSIS packaging.
fs.rmSync(path.join(standalone, ".next", "node_modules"), {
  recursive: true,
  force: true,
});

console.log("Prepared Next standalone server for Electron packaging.");
