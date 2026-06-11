// portalConfig.ts

export interface NavItem {
  id: string
  title: string
  path: string
  icon: string
  roles: ("sales_rep" | "hod" | "system_admin")[]
  description: string
}

export interface PortalConfig {
  systemName: string
  apiEndpoints: {
    header: string
    lines: string
    cancellation: string
    fulfillment: string
  }
  navigation: NavItem[]
  labels: {
    headerForm: Record<string, string>
    linesTable: Record<string, string>
    hodActions: Record<string, string>
    fulfillmentTable: Record<string, string>
  }
}

export const portalConfig: PortalConfig = {
  systemName: "B3 Order Allocation Portal",

  apiEndpoints: {
    header: "/api/v1/b3-orders/headers",
    lines: "/api/v1/b3-orders/lines",
    cancellation: "/api/v1/b3-orders/cancellation",
    fulfillment: "/api/v1/b3-orders/fulfillment-sync",
  },

  // Route definitions, permissions, and visual icons for the Sidebar layout
  navigation: [
    {
      id: "dashboard",
      title: "Allocation Dashboard",
      path: "/dashboard",
      icon: "LayoutDashboardIcon",
      roles: ["sales_rep", "hod", "system_admin"],
      description:
        "Overview of pending requests, approved volumes, and fulfillment tracking.",
    },
    {
      id: "orderEntry",
      title: "New Allocation Request",
      path: "/allocations/new",
      icon: "FilePlusIcon",
      roles: ["sales_rep"],
      description: "Create customer or item-specific B3 demand requests.",
    },
    {
      id: "hodApproval",
      title: "HOD Approval Queue",
      path: "/approvals/pending",
      icon: "ShieldCheckIcon",
      roles: ["hod"],
      description:
        "Review line items to approve quantities or log cancellations.",
    },
    {
      id: "soTracking",
      title: "Sales Order Fulfillment",
      path: "/fulfillment/tracking",
      icon: "ArrowLeftRightIcon",
      roles: ["sales_rep", "hod"],
      description: "Track B3 lines converted into actual backend Sales Orders.",
    },
  ],

  // Form fields, table headings, and modal UI labels mapped to your columns
  labels: {
    headerForm: {
      sectionTitle: "Order Allocation Header",
      HEADER_ID: "Allocation ID",
      TRANSACTION_DATE: "Request Date",
      CUSTOMER_OR_ITEM_SPECIFIC: "Allocation Basis",
      CUSTOMER_OR_ITEM_SPECIFIC_C: "Customer Specific",
      CUSTOMER_OR_ITEM_SPECIFIC_I: "Item Specific Only",
      CUSTOMER_ID: "Customer Account",
      TERRITORY_ID: "Regional Territory Zone",
      BILL_TO_CUSTOMER: "Bill-To Client ID",
      SHIP_TO_CUSTOMER: "Ship-To Destination ID",
      REMARKS: "Internal Notes / Remarks",
      submitBtn: "Submit to HOD Queue",
    },
    linesTable: {
      sectionTitle: "Demand Line Items",
      LINE_ID: "Line No",
      ORGANIZATION_ID: "Inventory Warehouse",
      INVENTORY_ITEM_ID: "Item Code / SKU",
      B3_QUANTITY: "Requested Quantity",
      TARGET_DATE: "Target Delivery Date",
      B3_APPROVED_QUANTITY: "Approved Quantity",
      APPROVAL_FLAG: "Approval Status",
      CLOSURE_FLAG: "Line Closure State",
      addLineBtn: "Add Item Row",
    },
    hodActions: {
      modalTitle: "Process Line Allocation",
      approveAction: "Approve Allocation",
      cancelAction: "Cancel / Reject Line",
      CANCELLED_QTY: "Quantity to Cancel",
      CANCEL_REASON: "Reason for Cancellation",
      cancelReasonPlaceholder:
        "Select or type why this item capacity was rejected...",
      confirmBtn: "Apply HOD Decision",
    },
    fulfillmentTable: {
      sectionTitle: "B3 Allocation vs Actual Sales Order Match",
      SO_LINE_ID: "ERP Sales Order Line ID",
      SO_LINE_NO: "Sales Order Doc Number",
      QUANTITY: "Physical Booked Quantity",
      ORDER_ENTERED_DATE: "ERP Insertion Timestamp",
      varianceLabel: "Quantity Variance Gap",
    },
  },
}
