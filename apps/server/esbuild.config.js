const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/server.ts"],
    outfile: "dist/server.js",
    bundle: true,
    platform: "node",
    target: "node20",
    sourcemap: true,
  })
  .catch(() => process.exit(1));
