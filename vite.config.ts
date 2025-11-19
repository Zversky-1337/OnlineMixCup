import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import * as path from "path";
import { ngrok } from "vite-plugin-ngrok";

export default defineConfig({
  plugins: [
    tailwindcss(),
    ngrok({
      domain: "erich-phlogotic-dolores.ngrok-free.dev",
      compression: true,
      authtoken: "35hCeruGLGicmDS42PbASAIPGVo_7uFrHte3CFg7JbESSfPjA",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./src/app"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@config": path.resolve(__dirname, "./config"),
      "@public": path.resolve(__dirname, "./public"),
    },
  },
  server: {
    port: 5173,
    allowedHosts: ["erich-phlogotic-dolores.ngrok-free.dev"],
  },
});
