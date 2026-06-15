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

export type UserRole = 'sales_rep' | 'hod' | 'system_admin'
export type AllocationBasis = 'customer_specific' | 'item_specific'
export type RequestStatus = 'pending' | 'approved' | 'partial_approved' | 'cancelled' | 'fulfilled' | 'on_hold'
export type LineStatus = 'pending' | 'approved' | 'cancelled' | 'fulfilled'
export type ApprovalDecision = 'approve' | 'cancel' | 'hold'

// User types
export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  department?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthContext {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
}

// Allocation Header
export interface AllocationHeader {
  id: string
  requestId: string
  createdDate: string
  allocationBasis: AllocationBasis
  customerId?: string
  customerName?: string
  billToId?: string
  shipToId?: string
  territory: string
  remarks?: string
  status: RequestStatus
  totalLines: number
  totalQuantity: number
  createdBy: string
  createdByName: string
  approvedBy?: string
  approvedDate?: string
  cancelledDate?: string
  expectedDeliveryFrom?: string
  expectedDeliveryTo?: string
  createdAt: string
  updatedAt: string
}

// Allocation Line Item
export interface AllocationLine {
  id: string
  allocationHeaderId: string
  lineNumber: number
  warehouse: string
  itemCode: string
  itemDescription?: string
  requestedQuantity: number
  targetDate: string
  status: LineStatus
  approvedQuantity?: number
  cancelledQuantity?: number
  cancelledReason?: string
  approvedBy?: string
  approvedDate?: string
  cancelledDate?: string
  createdAt: string
  updatedAt: string
}

// Fulfillment tracking
export interface FulfillmentRecord {
  id: string
  allocationHeaderId: string
  allocationLineId: string
  itemCode: string
  approvedQuantity: number
  soNumber?: string
  soLineNumber?: string
  soQuantity?: number
  orderDate?: string
  variance: number
  varianceType?: 'exact' | 'under_fulfilled' | 'over_fulfilled'
  erp_sync_status?: 'pending' | 'synced' | 'failed'
  erp_sync_date?: string
  createdAt: string
  updatedAt: string
}

// Approval History
export interface ApprovalHistory {
  id: string
  allocationLineId: string
  approverName: string
  approverId: string
  decision: ApprovalDecision
  approvedQuantity?: number
  cancelledQuantity?: number
  cancelledReason?: string
  remarks?: string
  approvalDate: string
}

// Cancellation History
export interface CancellationHistory {
  id: string
  allocationLineId: string
  cancelledQuantity: number
  reason: string
  cancelledBy: string
  cancelledDate: string
  remarks?: string
}

// Dashboard KPI
export interface DashboardKPI {
  pending: number
  approved: number
  cancelled: number
  fulfilled: number
  totalQuantity: number
  averageApprovalTime?: number
}

// Monthly trend
export interface MonthlyCancellation {
  month: string
  approved: number
  cancelled: number
}

// Territory data
export interface TerritoryData {
  territory: string
  allocations: number
  approvedQty: number
  cancelledQty: number
}

// Activity feed
export interface ActivityLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: 'created' | 'approved' | 'cancelled' | 'fulfilled'
  entityType: 'allocation_header' | 'allocation_line'
  entityId: string
  details?: Record<string, any>
}

// Query response
export interface QueryResponse<T> {
  data: T
  status: number
  message?: string
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Form submission
export interface AllocationFormData {
  header: AllocationHeader
  lines: AllocationLine[]
}

export interface ApprovalFormData {
  lineId: string
  decision: ApprovalDecision
  approvedQuantity?: number
  cancelledQuantity?: number
  cancelledReason?: string
  remarks?: string
}
