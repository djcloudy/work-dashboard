import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      "/api/jira": {
        target: "https://placeholder.atlassian.net",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/jira/, "/rest/api/3"),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            const realTarget = req.headers["x-proxy-target"] as string;
            if (realTarget) {
              const url = new URL(realTarget);
              proxyReq.setHeader("host", url.host);
              (proxy as any).options.target = realTarget;
            }
          });
        },
      },
      "/api/todoist": {
        target: "https://api.todoist.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/todoist/, "/rest/v2"),
      },
      "/api/toggl": {
        target: "https://api.track.toggl.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/toggl/, "/api/v9"),
      },
      "/api/grafana": {
        target: "https://placeholder.grafana.com",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/grafana/, "/api"),
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            const realTarget = req.headers["x-proxy-target"] as string;
            if (realTarget) {
              const url = new URL(realTarget);
              proxyReq.setHeader("host", url.host);
              (proxy as any).options.target = realTarget;
            }
          });
        },
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
