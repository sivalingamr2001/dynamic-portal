import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios"
import { ENV_CONFIG, getUserId } from "@/lib/utils"
import type { ApiErrorPayload, AppError } from "@/types"

const axiosInstance: AxiosInstance = axios.create({
  baseURL: ENV_CONFIG?.BASE_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userId = getUserId()
    if (userId) {
      config.headers["X-User-Id"] = userId
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError<ApiErrorPayload>) => {
    const appError: AppError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || "An unexpected error occurred.",
      details: error.response?.data?.details || null,
      isNetworkError: !error.response,
    }

    console.error(
      appError.isNetworkError ? "Network Error:" : "API Error:",
      appError
    )

    return Promise.reject(appError)
  }
)

export const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.get(url, config),

  post: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => axiosInstance.post(url, data, config),

  put: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => axiosInstance.put(url, data, config),

  patch: <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => axiosInstance.patch(url, data, config),

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    axiosInstance.delete(url, config),
}

export default axiosInstance
