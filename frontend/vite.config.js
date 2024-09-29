import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your backend URL
        changeOrigin: true,
        secure: false,
      },
      "/upload": {
        target: "http://localhost:5000", // Proxy for image uploads
        changeOrigin: true,
        secure: false,
      },
    }, 
  },
});
