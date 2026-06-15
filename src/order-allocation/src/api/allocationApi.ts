import { axiosClient } from "@/lib/axiosClient"

// -----------------------------------------
// TypeScript Interfaces (DTO Mappings)
// -----------------------------------------

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

// -----------------------------------------
// API Call Implementations
// -----------------------------------------

/**
 * Returns a unique array list of all system regions and sub-regions.
 * Maps to: GET /api/Allocation/regions
 */
export const getAllRegionsApi = async (): Promise<RegionDetailsDto[]> => {
  const response = await axiosClient.get<RegionDetailsDto[]>(
    "/Allocation/regions"
  )
  return response.data
}

/**
 * Gets unique customer billing assignments matching a specific region and sub-region.
 * Maps to: GET /api/Allocation/customers/bill-to?region=...&subRegion=...
 */
export const getBillToCustomersApi = async (
  region: string,
  subRegion: string
): Promise<CustomerDto[]> => {
  const response = await axiosClient.get<CustomerDto[]>(
    "/Allocation/customers/bill-to",
    {
      params: { region, subRegion },
    }
  )
  return response.data
}

/**
 * Gets unique shipping configurations for customers matching a specific region and sub-region.
 * Maps to: GET /api/Allocation/customers/ship-to?region=...&subRegion=...
 */
export const getShipToCustomersApi = async (
  region: string,
  subRegion: string
): Promise<CustomerDto[]> => {
  const response = await axiosClient.get<CustomerDto[]>(
    "/Allocation/customers/ship-to",
    {
      params: { region, subRegion },
    }
  )
  return response.data
}

/**
 * Pulls qualified executive employee profiles working out of a specific region.
 * Maps to: GET /api/Allocation/employees/prepared-by?region=...
 */
export const getPreparedByEmployeesApi = async (
  region: string
): Promise<EmployeeDto[]> => {
  const response = await axiosClient.get<EmployeeDto[]>(
    "/Allocation/employees/prepared-by",
    {
      params: { region },
    }
  )
  return response.data
}

/**
 * Queries multi-location structures matching a specific client, operational unit, and context.
 * Maps to: GET /api/Allocation/customers/{customerId}/addresses?siteUseCode=...&orgId=...
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
  const response = await axiosClient.get<OperatingUnitDto[]>(
    "/Allocation/operating-units"
  )
  return response.data
}
