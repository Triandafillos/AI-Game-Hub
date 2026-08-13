import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/games/arena-blaster/1.0.0/",
  build: {
    outDir: resolve(rootDir, "../../apps/platform/public/games/arena-blaster/1.0.0"),
    emptyOutDir: true,
  },
});
