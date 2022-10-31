import esbuild from "esbuild";
import htmlPlugin from "@chialab/esbuild-plugin-html";

const isProduction = process.env.NODE_ENV === "production";

await esbuild.build({
  entryPoints: ["src/index.html"],
  outdir: "dist",
  chunkNames: "[ext]/[name]-[hash]",
  assetNames: "[name]-[hash]",
  plugins: [htmlPlugin()],
  inject: ["./src/utils/node-shim.ts"],
  define: {
    Buffer: "Buffer",
    process: "process",
    ...(isProduction && { "process.env.NODE_ENV": "'production'" }),
  },
  minify: isProduction,
  splitting: true,
  format: "esm",
  sourcemap: true,
  bundle: true,
});
