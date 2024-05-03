import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { esbuildDecorators } from "esbuild-decorators";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [esbuildDecorators()],
    },
  },
  //build: {
  //  minify: false
  //}
});
