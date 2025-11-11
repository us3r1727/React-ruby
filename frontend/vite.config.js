import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      host: true,  // Adicione esta linha
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://backend:3000" ,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});