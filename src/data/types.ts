export type ItemStatus = "APPROVED" | "PENDING" | "AMEND" | "AMENDMENT_PENDING"

export type FulfillmentStatus = "Fulfilled" | "Partial" | "Open"

export type AllocationType = "customer" | "open-pool"

export interface CatalogItem {
  code: string
  name: string
  category: string
}

export interface Customer {
  id: string
  name: string
  region: string
}

export interface AllocationItem {
  id: string
  itemCode: string
  itemName: string
  customer: string
  region: string
  binQty: number
  approvedQty: number
  targetDate: string
  status: ItemStatus
}

export interface FulfillmentLine {
  id: string
  itemCode: string
  itemName: string
  customer: string
  region: string
  approvedQty: number
  allocated: number
  daysToOd: number
  status: FulfillmentStatus
}

export interface RecentEntry {
  id: string
  itemCode: string
  status: ItemStatus
  customer: string
  quantity: number
  targetDate: string
}

export interface ItemLineDraft {
  id: string
  organizationId: string
  itemCode: string
  itemName: string
  rrsCategory?: string
  qty: number
  targetDate: string
}
