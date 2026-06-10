import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ApiError, ApiResponse } from "../types/api.types";
import { env } from "../../app/config/env";

let _accessToken: string | null = null;
let _refreshToken: string | null = null;
let _onTokenRefreshed: ((token: string) => void) | null = null;
let _onAuthFailure: (() => void) | null = null;

export const tokenManager = {
  setTokens: (access: string, refresh: string) => {
    _accessToken = access;
    _refreshToken = refresh;
    sessionStorage.setItem(env.AUTH_TOKEN_KEY, access);
    sessionStorage.setItem(env.REFRESH_TOKEN_KEY, refresh);
  },
  clearTokens: () => {
    _accessToken = null;
    _refreshToken = null;
    sessionStorage.removeItem(env.AUTH_TOKEN_KEY);
    sessionStorage.removeItem(env.REFRESH_TOKEN_KEY);
  },
  getAccessToken: (): string | null => _accessToken ?? sessionStorage.getItem(env.AUTH_TOKEN_KEY),
  getRefreshToken: (): string | null =>
    _refreshToken ?? sessionStorage.getItem(env.REFRESH_TOKEN_KEY),
  onTokenRefreshed: (cb: (token: string) => void) => {
    _onTokenRefreshed = cb;
  },
  onAuthFailure: (cb: () => void) => {
    _onAuthFailure = cb;
  },
};

// ─── Refresh token queue ──────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else if (token) resolve(token);
  });
  failedQueue = [];
};

// ─── Axios instance ───────────────────────────────────────────────────────────
export const httpClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-App-Version": import.meta.env.VITE_APP_VERSION ?? "1.0.0",
  },
});

// ─── Request interceptor ──────────────────────────────────────────────────────
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Attach request ID for tracing
    config.headers["X-Request-ID"] = crypto.randomUUID();
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────────────────
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return httpClient(originalRequest);
          })
          .catch(Promise.reject);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post<{
          accessToken: string;
          refreshToken: string;
        }>(`${env.API_BASE_URL}/auth/refresh`, { refreshToken });

        tokenManager.setTokens(data.accessToken, data.refreshToken);
        _onTokenRefreshed?.(data.accessToken);
        processQueue(null, data.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenManager.clearTokens();
        _onAuthFailure?.();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalise error shape
    const apiError: ApiError = {
      code: error.response?.data?.code ?? "UNKNOWN_ERROR",
      message: error.response?.data?.message ?? error.message ?? "An error occurred",
      details: error.response?.data?.details,
      statusCode: error.response?.status ?? 0,
    };

    return Promise.reject(apiError);
  }
);

// ─── Typed helpers ────────────────────────────────────────────────────────────
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    httpClient.get<ApiResponse<T>>(url, config).then((r) => r.data.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.post<ApiResponse<T>>(url, data, config).then((r) => r.data.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.put<ApiResponse<T>>(url, data, config).then((r) => r.data.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    httpClient.patch<ApiResponse<T>>(url, data, config).then((r) => r.data.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    httpClient.delete<ApiResponse<T>>(url, config).then((r) => r.data.data),
};
