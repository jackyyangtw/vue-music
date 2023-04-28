import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true, // import testing function globally
  },
  plugins: [
    vue(),
    VitePWA({
      display: "standalone",
      // registerType: "autoUpdate",
      // registerType: "dev",
      registerType: "prompt",
      devOptions: {
        // enabled: true,
        enabled: false, // 開發時不啟用service worker，不過build的時候會啟用
      },
      manifest: {
        name: "Vue Music",
        theme_color: "#1F2937",
        icons: [
          {
            src: "assets/img/logo.jpg",
            sizes: "192x192",
            type: "image/jpg",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,}"],
      },
    }),
    visualizer({ open: true }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js",
    },
  },
});
