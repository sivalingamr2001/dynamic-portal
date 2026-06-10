// src/app/router/routes/__root.tsx
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet, ScrollRestoration } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Suspense } from "react";
import { ErrorBoundary } from "../../../shared/components/ErrorBoundary";
import { useAuthStore } from "../../../store/authStore";
import { Loader } from "../../../shared/components/Loader";

interface RouterContext {
  queryClient: QueryClient;
  auth: ReturnType<typeof useAuthStore.getState>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  errorComponent: RootErrorComponent,
  notFoundComponent: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-300">404</h1>
        <p className="mt-4 text-slate-600">Page not found</p>
      </div>
    </div>
  ),
});

function RootComponent() {
  return (
    <ErrorBoundary>
      <ScrollRestoration />
      <Suspense fallback={<Loader />}>
        <Outlet />
      </Suspense>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </ErrorBoundary>
  );
}

function RootErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex h-screen items-center justify-center bg-red-50">
      <div className="max-w-lg rounded-xl border border-red-200 bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-red-600">Application Error</h2>
        <p className="mt-2 text-slate-600">{error.message}</p>
        <button
          className="mt-6 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Reload Application
        </button>
      </div>
    </div>
  );
}
