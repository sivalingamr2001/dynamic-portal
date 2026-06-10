// src/shared/services/authService.ts
import { api } from "@api/httpClient";
import { User, AuthTokens, LoginCredentials } from "@shared/types/auth.types";

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  login: (credentials: LoginCredentials): Promise<LoginResponse> =>
    api.post<LoginResponse>("/auth/login", credentials),

  logout: (): Promise<void> => api.post("/auth/logout"),

  getMe: (): Promise<User> => api.get<User>("/auth/me"),

  refreshTokens: (refreshToken: string): Promise<AuthTokens> =>
    api.post<AuthTokens>("/auth/refresh", { refreshToken }),
};
