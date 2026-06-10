export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api",
  APP_ENV: (import.meta.env.MODE ?? "development") as "development" | "staging" | "production",
  AUTH_TOKEN_KEY: "auth_token",
  REFRESH_TOKEN_KEY: "refresh_token",
} as const;

export type AppEnv = typeof env;
