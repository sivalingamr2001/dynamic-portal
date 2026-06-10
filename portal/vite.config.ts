// vite.config.ts
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Setting the 3rd parameter to "" loads ALL variables instead of just those prefixed with VITE_.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    // 1. CRITICAL FIX: Stubs process.env for the browser environment.
    // This stops httpClient.ts from throwing "Module 'process' has been externalized" errors.
    define: {
      "process.env": {},
      "process.env.NODE_ENV": JSON.stringify(mode),
      "process.env.VITE_API_BASE_URL": JSON.stringify(env.VITE_API_BASE_URL),
    },

    plugins: [
      TanStackRouterVite({
        routesDirectory: "./src/app/router/routes",
        generatedRouteTree: "./src/app/router/routeTree.gen.ts",
        autoCodeSplitting: true,
      }),
      react(),
    ],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@app": path.resolve(__dirname, "./src/app"),
        "@shared": path.resolve(__dirname, "./src/shared"),
        "@portals": path.resolve(__dirname, "./src/portals"),
        "@store": path.resolve(__dirname, "./src/store"),
        "@components": path.resolve(__dirname, "./src/shared/components"),
        "@hooks": path.resolve(__dirname, "./src/shared/hooks"),
        "@utils": path.resolve(__dirname, "./src/shared/lib"),
        "@types": path.resolve(__dirname, "./src/shared/types"),
        "@api": path.resolve(__dirname, "./src/shared/api"),
        "@constants": path.resolve(__dirname, "./src/shared/constants"),
      },
    },

    build: {
      target: "esnext",
      rollupOptions: {
        output: {
          manualChunks: {
            "react-vendor": ["react", "react-dom"],
            "router-vendor": ["@tanstack/react-router"],
            "query-vendor": ["@tanstack/react-query"],
            "form-vendor": ["react-hook-form", "@hookform/resolvers", "zod"],
            "state-vendor": ["zustand"],
          },
        },
      },
    },

    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "@tanstack/react-router",
        "@tanstack/react-query",
        "axios",
        "zustand",
      ],
    },

    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL || "http://localhost:8080",
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
