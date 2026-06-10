// src/shared/types/auth.types.ts
import { Role, Permission } from "@constants/roles";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  roles: Role[];
  permissions: Permission[];
  portalAccess: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
