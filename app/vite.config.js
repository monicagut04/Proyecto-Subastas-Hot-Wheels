/* eslint-disable no-undef */
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import jsconfigPaths from "vite-jsconfig-paths";

// https://vite.dev/config/
export default defineConfig({

  base: './', 

  plugins: [
    react(), 
    tailwindcss(), 
    jsconfigPaths()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 2. OPCIONAL: Esto ayuda a que el build sea más limpio para GitHub
  build: {
    outDir: 'dist',
  }
});