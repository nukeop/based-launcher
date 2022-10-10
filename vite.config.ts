import native from "./native-plugin";
import pkg from "./package.json";
import react from "@vitejs/plugin-react";
import { spawn } from "child_process";
import electronPath from "electron";
import { rmSync } from "fs";
import path from "path";
import { type Plugin, type UserConfig, defineConfig } from "vite";
import electron, { onstart } from "vite-plugin-electron";

rmSync(path.join(__dirname, "dist"), { recursive: true, force: true }); // v14.14.0

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
      styles: path.join(__dirname, "src/assets/styles"),
    },
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: "electron/main/index.ts",
        vite: withDebug({
          build: {
            outDir: "dist/electron/main",
          },
          plugins: [
            native(),
            onstart(() => {
              if (!(process.env.NODE_ENV === "production")) {
                if (process.electronApp) {
                  process.electronApp.removeAllListeners();
                  process.electronApp.kill();
                }

                // Start Electron.app
                process.electronApp = spawn(
                  electronPath,
                  [".", "--no-sandbox", ...process.argv],
                  {
                    stdio: "inherit",
                  }
                );
                // Exit command after Electron.app exits
                process.electronApp.once("exit", process.exit);
              }
            }),
          ],
        }),
      },
      preload: {
        input: {
          // You can configure multiple preload scripts here
          index: path.join(__dirname, "electron/preload/index.ts"),
        },
        vite: {
          build: {
            // For debug
            sourcemap: "inline",
            outDir: "dist/electron/preload",
          },
        },
      },
      // Enables use of Node.js API in the Electron-Renderer
      // https://github.com/electron-vite/vite-plugin-electron/tree/main/packages/electron-renderer#electron-renderervite-serve
      renderer: {},
    }),
  ],
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT,
  },
  build: {
    minify: false,
  },
});

function withDebug(config: UserConfig): UserConfig {
  if (process.env.VSCODE_DEBUG) {
    config.build.sourcemap = true;
    config.plugins = (config.plugins || []).concat({
      name: "electron-vite-debug",
      configResolved(config) {
        const index = config.plugins.findIndex(
          (p) => p.name === "electron-main-watcher"
        );
        // At present, Vite can only modify plugins in configResolved hook.
        (config.plugins as Plugin[]).splice(index, 1);
      },
    });
  }
  return config;
}
