import type { PortalConfig } from "./portalConfig.types"

export type {
  AllocationBasis,
  FormFieldConfig,
  NavItem,
  PortalConfig,
  RoleConfig,
  StatusConfig,
  TableColumn,
  UserRole,
} from "./portalConfig.types"

export const defaultPortalConfig: PortalConfig = {
  // Application metadata
  app: {
    name: "BIN Portal - Sales",
    version: "1.0.0",
    description:
      "Enterprise order allocation and fulfillment management system",
    logo: "https://www.janatics.com/assets/images/favicons/favicon.svg",
  },

  api: {
    baseUrl: "https://api.b3-portal.local/v1",
    endpoints: {
      headers: "/allocations/headers",
      lines: "/allocations/lines",
      approvals: "/approvals",
      cancellations: "/cancellations",
      fulfillment: "/fulfillment",
      users: "/users",
      audit: "/audit",
    },
  },

  // Navigation configuration
  navigation: {
    primary: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "dashboard",
        icon: "LayoutGrid",
        description: "Overview and key metrics",
        roles: ["Hod", "User"],
        children: [],
      },
      {
        id: "new-allocation",
        label: "New Allocation Request",
        path: "allocations/new",
        icon: "Plus",
        description: "Create new allocation request",
        roles: ["Admin", "Hod", "User"],
        children: [],
      },
      {
        id: "my-allocations",
        label: "My Allocations",
        path: "allocations/list",
        icon: "List",
        description: "View your allocation requests",
        roles: ["Admin", "Hod", "User"],
        children: [],
      },
      {
        id: "approvals",
        label: "Approvals",
        path: "approvals",
        icon: "CheckCircle",
        description: "Review and approve requests",
        roles: ["Hod", "Admin"],
        children: [],
      },
      {
        id: "fulfillment",
        label: "Fulfillment",
        path: "fulfillment",
        icon: "TrendingUp",
        description: "Track fulfillment and variance",
        roles: ["User", "Hod", "Admin"],
        children: [],
      },
      {
        id: "config",
        label: "Configuration",
        path: "admin/config",
        icon: "Sliders",
        description: "API and system settings",
        roles: ["Admin"],
        children: [],
      },
      {
        id: "roles",
        label: "Roles & Permissions",
        path: "admin/roles",
        icon: "Users",
        description: "Manage user roles",
        roles: ["Admin"],
        children: [],
      },
      {
        id: "audit",
        label: "Audit Logs",
        path: "admin/audit",
        icon: "Activity",
        description: "System activity logs",
        roles: ["Admin"],
        children: [],
      },
    ],
  },

  // Form labels and field configurations
  forms: {
    allocationHeader: {
      requestDate: {
        label: "Request Date",
        placeholder: "Select date",
        required: true,
      },
      allocationBasis: {
        label: "Allocation Basis",
        placeholder: "Select allocation basis",
        required: true,
        options: [
          { value: "customer_specific", label: "Customer Specific" },
          { value: "item_specific", label: "Item Specific" },
        ],
      },
      customer: {
        label: "Customer",
        placeholder: "Search and select customer",
        required: false,
      },
      billTo: {
        label: "Bill To",
        placeholder: "Select bill to address",
        required: false,
      },
      shipTo: {
        label: "Ship To",
        placeholder: "Select ship to address",
        required: false,
      },
      territory: {
        label: "Territory",
        placeholder: "Select territory",
        required: true,
      },
      remarks: {
        label: "Remarks",
        placeholder: "Enter any additional remarks",
        required: false,
      },
    },

    lineItem: {
      warehouse: {
        label: "Warehouse",
        placeholder: "Select warehouse",
        required: true,
      },
      itemCode: {
        label: "Item Code",
        placeholder: "Enter item code",
        required: true,
      },
      requestedQuantity: {
        label: "Requested Quantity",
        placeholder: "Enter quantity",
        required: true,
      },
      targetDate: {
        label: "Target Date",
        placeholder: "Select date",
        required: true,
      },
    },

    approval: {
      approvedQuantity: {
        label: "Approved Quantity",
        placeholder: "Enter approved quantity",
        required: true,
      },
      decision: {
        label: "Decision",
        placeholder: "Select decision",
        required: true,
        options: [
          { value: "approve", label: "Approve" },
          { value: "cancel", label: "Cancel" },
          { value: "hold", label: "Hold for Review" },
        ],
      },
    },

    cancellation: {
      cancelledQuantity: {
        label: "Cancelled Quantity",
        placeholder: "Enter quantity",
        required: true,
      },
      reason: {
        label: "Cancellation Reason",
        placeholder: "Select reason",
        required: true,
        options: [
          { value: "out_of_stock", label: "Out of Stock" },
          { value: "customer_request", label: "Customer Request" },
          {
            value: "insufficient_allocation",
            label: "Insufficient Allocation",
          },
          { value: "unavailable_date", label: "Unavailable Delivery Date" },
          { value: "other", label: "Other" },
        ],
      },
    },
  },

  // Table configurations
  tables: {
    allocationHeaders: {
      columns: [
        { key: "requestId", label: "Request ID", width: "10%" },
        { key: "createdDate", label: "Created Date", width: "12%" },
        { key: "territory", label: "Territory", width: "12%" },
        { key: "totalLines", label: "Lines", width: "8%" },
        { key: "totalQuantity", label: "Total Qty", width: "10%" },
        { key: "status", label: "Status", width: "12%" },
        { key: "actions", label: "Actions", width: "15%" },
      ],
    },

    lineItems: {
      columns: [
        { key: "lineNumber", label: "Line #", width: "8%" },
        { key: "warehouse", label: "Warehouse", width: "12%" },
        { key: "itemCode", label: "Item Code", width: "12%" },
        { key: "itemDescription", label: "Description", width: "20%" },
        { key: "requestedQty", label: "Req Qty", width: "10%" },
        { key: "targetDate", label: "Target Date", width: "12%" },
        { key: "status", label: "Status", width: "12%" },
        { key: "actions", label: "Actions", width: "12%" },
      ],
    },

    approvalQueue: {
      columns: [
        { key: "requestId", label: "Request ID", width: "10%" },
        { key: "createdDate", label: "Created Date", width: "12%" },
        { key: "customer", label: "Customer", width: "12%" },
        { key: "territory", label: "Territory", width: "10%" },
        { key: "lineCount", label: "Lines", width: "8%" },
        { key: "totalQty", label: "Total Qty", width: "10%" },
        { key: "status", label: "Status", width: "12%" },
        { key: "actions", label: "Actions", width: "15%" },
      ],
    },

    fulfillment: {
      columns: [
        { key: "allocationId", label: "Allocation ID", width: "10%" },
        { key: "lineId", label: "Line ID", width: "8%" },
        { key: "itemCode", label: "Item Code", width: "10%" },
        { key: "approvedQty", label: "Approved Qty", width: "10%" },
        { key: "soNumber", label: "SO Number", width: "10%" },
        { key: "soQty", label: "SO Qty", width: "10%" },
        { key: "variance", label: "Variance", width: "10%" },
        { key: "status", label: "Status", width: "10%" },
        { key: "actions", label: "Actions", width: "12%" },
      ],
    },
  },

  // Status configurations
  statuses: {
    request: {
      pending: {
        label: "Pending",
        color: "amber",
        icon: "Clock",
      },
      approved: {
        label: "Approved",
        color: "green",
        icon: "CheckCircle",
      },
      partial_approved: {
        label: "Partial Approved",
        color: "blue",
        icon: "AlertCircle",
      },
      cancelled: {
        label: "Cancelled",
        color: "red",
        icon: "XCircle",
      },
      fulfilled: {
        label: "Fulfilled",
        color: "emerald",
        icon: "CheckSquare",
      },
      on_hold: {
        label: "On Hold",
        color: "slate",
        icon: "Pause",
      },
    },

    line: {
      pending: {
        label: "Pending",
        color: "amber",
        icon: "Clock",
      },
      approved: {
        label: "Approved",
        color: "green",
        icon: "CheckCircle",
      },
      cancelled: {
        label: "Cancelled",
        color: "red",
        icon: "XCircle",
      },
      fulfilled: {
        label: "Fulfilled",
        color: "emerald",
        icon: "CheckSquare",
      },
    },
  },

  // Role permissions
  roles: {
    User: {
      label: "Sales Representative",
      permissions: [
        "view_dashboard",
        "create_allocation",
        "view_own_allocations",
        "view_fulfillment",
      ],
    },
    Hod: {
      label: "Head of Department",
      permissions: [
        "view_dashboard",
        "create_allocation",
        "view_allocations",
        "approve_allocation",
        "cancel_allocation",
        "view_fulfillment",
      ],
    },
    Admin: {
      label: "System Administrator",
      permissions: [
        "view_dashboard",
        "create_allocation",
        "view_allocations",
        "approve_allocation",
        "cancel_allocation",
        "view_fulfillment",
        "manage_users",
        "manage_roles",
        "view_audit_logs",
        "manage_configuration",
      ],
    },
  },

  // Demo/Mock data
  territories: [
    { id: "north", label: "North Region" },
    { id: "south", label: "South Region" },
    { id: "east", label: "East Region" },
    { id: "west", label: "West Region" },
    { id: "central", label: "Central Region" },
  ],

  warehouses: [
    { id: "wh_01", label: "Warehouse 1 - Delhi" },
    { id: "wh_02", label: "Warehouse 2 - Mumbai" },
    { id: "wh_03", label: "Warehouse 3 - Bangalore" },
    { id: "wh_04", label: "Warehouse 4 - Chennai" },
  ],

  cancellationReasons: [
    { value: "out_of_stock", label: "Out of Stock" },
    { value: "customer_request", label: "Customer Request" },
    { value: "insufficient_allocation", label: "Insufficient Allocation" },
    { value: "unavailable_date", label: "Unavailable Delivery Date" },
    { value: "pricing_issue", label: "Pricing Issue" },
    { value: "other", label: "Other" },
  ],
}

/** @deprecated Use `defaultPortalConfig` or `usePortalConfig()` instead */
export const portalConfig = defaultPortalConfig

export default defaultPortalConfig
