export type UserRole = "Admin" | "Hod" | "User"
export type AllocationBasis = "customer_specific" | "item_specific"

export interface FormFieldConfig {
  label: string
  placeholder: string
  required: boolean
  options?: Array<{ value: string; label: string }>
}

export interface NavItem {
  id: string
  label: string
  path: string
  icon: string
  description: string
  roles: UserRole[]
  children: NavItem[]
  badge?: string
}

export interface TableColumn {
  key: string
  label: string
  width: string
}

export interface StatusConfig {
  label: string
  color: string
  icon: string
}

export interface RoleConfig {
  label: string
  permissions: string[]
}

export interface PortalConfig {
  app: {
    name: string
    version: string
    description: string
    logo: string
  }
  api: {
    baseUrl: string
    endpoints: {
      headers: string
      lines: string
      approvals: string
      cancellations: string
      fulfillment: string
      users: string
      audit: string
    }
  }
  navigation: {
    primary: NavItem[]
  }
  forms: {
    allocationHeader: Record<string, FormFieldConfig>
    lineItem: Record<string, FormFieldConfig>
    approval: Record<string, FormFieldConfig>
    cancellation: Record<string, FormFieldConfig>
  }
  tables: {
    allocationHeaders: { columns: TableColumn[] }
    lineItems: { columns: TableColumn[] }
    approvalQueue: { columns: TableColumn[] }
    fulfillment: { columns: TableColumn[] }
  }
  statuses: {
    request: Record<string, StatusConfig>
    line: Record<string, StatusConfig>
  }
  roles: Record<UserRole, RoleConfig>
  territories: Array<{ id: string; label: string }>
  warehouses: Array<{ id: string; label: string }>
  cancellationReasons: Array<{ value: string; label: string }>
}
