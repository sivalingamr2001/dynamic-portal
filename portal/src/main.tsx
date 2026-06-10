import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { AppProviders } from "./app/providers";
import { router } from "./app/router";
import { tokenManager } from "./shared/api/httpClient";
import { useAuthStore } from "./store/authStore";

tokenManager.onAuthFailure(() => {
  useAuthStore.getState().logout();
});

const init = async () => {
  const token = tokenManager.getAccessToken();
  if (token) {
    try {
      await useAuthStore.getState().refreshUser();
    } catch {
      // Silently fail — will redirect to login via route guard
    }
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </React.StrictMode>
  );
};

init();
