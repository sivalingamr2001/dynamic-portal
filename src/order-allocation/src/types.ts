// Query parameters sent from frontend to backend
export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface PagedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface AppError {
  status: number
  message: string
  details?: unknown
  isNetworkError: boolean
}

export interface ApiErrorPayload {
  message?: string
  details?: unknown
}
