import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { useAuthStore } from "../../store/authStore";
import { getQueryClient } from "../providers/QueryProvider";

export const router = createRouter({
  routeTree,
  context: {
    queryClient: getQueryClient(),
    auth: useAuthStore.getState(),
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: ({ error }) => (
    <div className="p-8 text-red-600">Route error: {(error as Error).message}</div>
  ),
});

// Keep router context in sync with auth store
useAuthStore.subscribe((state) => {
  router.invalidate();
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
