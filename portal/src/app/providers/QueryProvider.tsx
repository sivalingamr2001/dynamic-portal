import React from "react";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ApiError } from "../../shared/types/api.types";
import { useAuthStore } from "../../store/authStore";

const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof (error as any).statusCode === "number"
  );
};

const createQueryClient = () => {
  const handleAuthError = (error: unknown) => {
    if (isApiError(error) && error.statusCode === 401) {
      useAuthStore.getState().logout();
    }
  };

  return new QueryClient({
    queryCache: new QueryCache({
      onError: handleAuthError,
    }),
    mutationCache: new MutationCache({
      onError: handleAuthError,
    }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
        retry: (failureCount, error) => {
          const apiError = error as unknown as ApiError;
          // Don't retry on auth or client errors
          if (apiError?.statusCode >= 400 && apiError?.statusCode < 500) {
            return false;
          }
          return failureCount < 3;
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: "always",
      },
      mutations: {
        retry: false,
      },
    },
  });
};

// Singleton for app lifetime
let queryClient: QueryClient | null = null;

export const getQueryClient = () => {
  if (!queryClient) queryClient = createQueryClient();
  return queryClient;
};

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const client = React.useRef(getQueryClient());

  return (
    <QueryClientProvider client={client.current}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
