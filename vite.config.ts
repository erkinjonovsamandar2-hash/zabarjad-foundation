import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "https://ovlqfgjdmbvstqibrqrl.supabase.co";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      // Proxy all Supabase traffic through localhost in development.
      // This bypasses CORS/sandbox restrictions in Lovable's preview iframe.
      "/_sb": {
        target: SUPABASE_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/_sb/, ""),
        ws: true, // also proxy WebSocket (realtime)
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
