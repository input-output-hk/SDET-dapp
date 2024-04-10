import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const getLibsodiumImports = (code: string) => {
  const regex = /import {(.*)} from (?:'|")libsodium-wrappers-sumo(?:'|")/g;

  let matches,
    libsodiumImports: Array<string> = [];

  while ((matches = regex.exec(code))) {
    libsodiumImports = [
      ...libsodiumImports,
      ...matches[1].split(",").map((importedValue) => importedValue.trim()),
    ];
  }

  return libsodiumImports;
};

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env": process.env,
    "process.version": `'${process.version}'`,
  },
  plugins: [
    {
      // We need this plugin since libsodium doesn't support proper ESM modules. When esbuild transforms the libsodium package to ESM
      // it doesn't allow the libsodium package to "replace" the imported functions with the real implementation when `await ready` is called.
      // For some reason this works in webpack but not with vite, probably due to the internal implementation of module caching and resolution.
      name: "fix-libsodium",
      transform(code: string, id: string) {
        // only replace the import paths in the `@cardano-sdk/crypto` package
        if (!id.match(/packages\/crypto/) && !id.match(/cardano-sdk\/crypto/)) {
          return;
        }

        getLibsodiumImports(code)
          // ready is too generic of a word to replace so don't include it in the list
          .filter((importedValue) => importedValue !== "ready")
          .forEach((importedValue) => {
            const regex = new RegExp(`(?<!import.*)${importedValue}`, "g");
            code = code.replaceAll(regex, `libsodium.${importedValue}`);
          });

        return code
          .replace(
            /import.*('|")libsodium-wrappers-sumo('|")/,
            'import libsodium from "libsodium-wrappers-sumo"'
          )
          .replaceAll("await ready", "await libsodium.ready");
      },
    },
    nodePolyfills({
      include: [
        "stream",
        "http",
        "util",
        "_stream_readable",
        "_stream_writable",
        "events",
        "fs",
      ],
      globals: {
        Buffer: true,
        global: true,
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: true,
    }),
    preact({
      prerender: {
        enabled: true,
        renderTarget: "#app",
        additionalPrerenderRoutes: ["/404"],
      },
    }),
  ],
  resolve: {
    alias: [
      {
        find: /@emurgo\/cardano-message-signing-nodejs/,
        replacement: "@emurgo/cardano-message-signing-asmjs",
      },
      {
        find: /@dcspark\/cardano-multiplatform-lib-nodejs/,
        replacement: "@dcspark/cardano-multiplatform-lib-browser",
      },
      { find: /blake2b$/, replacement: "blake2b-no-wasm" },
    ],
    extensions: [".ts", ".js", ".tsx", ".jsx"],
  },
  server: {
    watch: {
      ignored: ["**/node_modules", "./dist"],
    },
  },
});
