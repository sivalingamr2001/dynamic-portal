import { axiosClient } from "@/lib/axiosClient"

// =========================================================================
// DATA TRANSFER OBJECTS (DTOs) & DATA LAYOUT SCHEMAS
// =========================================================================

export interface RegionDetailsDto {
  region: string
  subRegion: string
}

export interface CustomerDto {
  customerId: number
  customerName: string
  region: string
}

export interface EmployeeDto {
  lastName: string
  employeeNumber: string
}

export interface AddressDto {
  address1: string
  address2: string
  address3: string
  city: string
  postalCode: string
  orgId: number
  location: string
}

export interface OperatingUnitDto {
  organizationId: number
  name: string
}

export interface ItemOperatingUnitDto {
  organizationId: number
  organizationCode: string
}

export interface AllocationItemDto {
  inventoryItemId: number
  itemCode: string
  Description?: string
}

export interface RrsCategoryResponseDto {
  rrsCategory: string
}

export interface DemandMetricsDto {
  oaPendingQuantity: number
  oaRsvQty: number
  oaPickedQty: number
  binQty: number
  binRsvQty: number
}

export interface PagedResult<T> {
  data: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// =========================================================================
// CORE CONFIGURATION HEADERS LAYER (ALLOCATION ENDPOINTS)
// =========================================================================

/**
 * Returns a unique array list of all system regions and sub-regions.
 * Maps to: GET /api/Allocation/regions
 */
export const getAllRegionsApi = async (): Promise<RegionDetailsDto[]> => {
  const response = await axiosClient.get<RegionDetailsDto[]>("/Allocation/regions")
  return response.data
}

/**
 * Gets unique customer billing assignments matching a specific region and sub-region.
 * Maps to: GET /api/Allocation/customers/bill-to
 */
export const getBillToCustomersApi = async (
  region: string,
  subRegion: string
): Promise<CustomerDto[]> => {
  const response = await axiosClient.get<CustomerDto[]>("/Allocation/customers/bill-to", {
    params: { region, subRegion },
  })
  return response.data
}

/**
 * Gets unique shipping configurations for customers matching a specific region and sub-region.
 * Maps to: GET /api/Allocation/customers/ship-to
 */
export const getShipToCustomersApi = async (
  region: string,
  subRegion: string
): Promise<CustomerDto[]> => {
  const response = await axiosClient.get<CustomerDto[]>("/Allocation/customers/ship-to", {
    params: { region, subRegion },
  })
  return response.data
}

/**
 * Pulls qualified executive employee profiles working out of a specific region.
 * Maps to: GET /api/Allocation/employees/prepared-by
 */
export const getPreparedByEmployeesApi = async (region: string): Promise<EmployeeDto[]> => {
  const response = await axiosClient.get<EmployeeDto[]>("/Allocation/employees/prepared-by", {
    params: { region },
  })
  return response.data
}

/**
 * Queries multi-location structures matching a specific client, operational unit, and context.
 * Maps to: GET /api/Allocation/customers/{customerId}/addresses
 */
export const getCustomerAddressesApi = async (
  customerId: number,
  siteUseCode: "BILL_TO" | "SHIP_TO",
  orgId: number
): Promise<AddressDto[]> => {
  const response = await axiosClient.get<AddressDto[]>(
    `/Allocation/customers/${customerId}/addresses`,
    {
      params: { siteUseCode, orgId },
    }
  )
  return response.data
}

/**
 * Generates system standard upcoming sequence loops for UI selector dropdown items.
 * Maps to: GET /api/Allocation/weeks/dropdown
 */
export const getWeeksDropdownApi = async (): Promise<string[]> => {
  const response = await axiosClient.get<string[]>("/Allocation/weeks/dropdown")
  return response.data
}

/**
 * Retrieves targeted corporate operational unit profiles filtered by core organization identifiers.
 * Maps to: GET /api/Allocation/operating-units
 */
export const getOperatingUnitsApi = async (): Promise<OperatingUnitDto[]> => {
  const response = await axiosClient.get<OperatingUnitDto[]>("/Allocation/operating-units")
  return response.data
}

// =========================================================================
// TRANSACTION GRID DETAIL LAYER (ALLOCATIONS ENDPOINTS)
// =========================================================================

/**
 * Fetches the list of valid operational organization units for item rows.
 * Maps to: GET /api/allocations/organizations
 */
export const getItemOperatingUnits = async (): Promise<ItemOperatingUnitDto[]> => {
  const response = await axiosClient.get<ItemOperatingUnitDto[]>("/allocations/organizations")
  return response.data
}

/**
 * Retrieves the designated RRS Category string for a specific organization item match.
 * Maps to: GET /api/allocations/rrs-category
 */
export const getItemRrsCategory = async (
  organizationId: number | string,
  inventoryItemId: number | string
): Promise<RrsCategoryResponseDto> => {
  const response = await axiosClient.get<RrsCategoryResponseDto>("/allocations/rrs-category", {
    params: { organizationId, inventoryItemId },
  })
  return response.data
}

/**
 * Fetches a paginated, filterable collection of inventory items.
 * Maps to: GET /api/allocations/items
 */
export const getPaginatedItems = async (
  page: number,
  pageSize: number,
  search?: string
): Promise<PagedResult<AllocationItemDto>> => {
  const response = await axiosClient.get<PagedResult<AllocationItemDto>>("/allocations/items", {
    params: {
      page,
      pageSize,
      search: search?.trim() || undefined,
    },
  })
  return response.data
}

/**
 * Resolves item identifiers and details based on a single exact item code string.
 * Maps to: GET /api/allocations/items/{itemCode}
 */
export const getItemByCode = async (itemCode: string): Promise<AllocationItemDto> => {
  const response = await axiosClient.get<AllocationItemDto>(
    `/allocations/items/${encodeURIComponent(itemCode.trim())}`
  )
  return response.data
}

/**
 * Retrieves reference totals, balances, and demand metrics from your Oracle views.
 * Maps exactly to: GET /api/allocations/demand-metrics?customerId=X&organizationId=Y&inventoryItemId=Z
 */
export const getDemandMetricsApi = async (
  customerId: number,
  organizationId: number,
  inventoryItemId: number
): Promise<DemandMetricsDto> => {
  const response = await axiosClient.get<DemandMetricsDto>("/allocations/demand-metrics", {
    params: { customerId, organizationId, inventoryItemId },
  })
  return response.data
}
