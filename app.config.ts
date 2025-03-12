import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  ssr: true,
  middleware: "./src/middleware.ts",
  vite: {
    server: {
      allowedHosts: "host.docker.internal",
    },
    plugins: [
      tailwindcss(),
      tsconfigPaths(),
      // visualizer({
      //   gzipSize: true,
      //   brotliSize: true,
      //   emitFile: false,
      //   filename: "test.html", //分析图生成的文件名
      //   open: true, //如果存在本地服务端口，将在打包后自动展示
      // }),
    ],
  },
});
