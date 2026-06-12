import { lazy } from "react"

// Layout
export { AppLayout } from "../layout/AppLayout"
export { AuthLayout } from "../layout/AuthLayout"
export { ProtectedLayout } from "../layout/ProtectedLayout"

// App Pages
export const DashboardPage = lazy(() =>
  import("@/pages/dashboard/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  }))
)

// Admin Pages

export const AuditLogsPage = lazy(() =>
  import("@/pages/admin/AuditLogsPage").then((module) => ({
    default: module.AuditLogsPage,
  }))
)

export const ConfigPage = lazy(() =>
  import("@/pages/admin/ConfigPage").then((module) => ({
    default: module.ConfigPage,
  }))
)

export const RolesPage = lazy(() =>
  import("@/pages/admin/RolesPage").then((module) => ({
    default: module.RolesPage,
  }))
)

// Allocation page
export const MyAllocationsPage = lazy(() =>
  import("@/pages/allocations/MyAllocationsPage").then((module) => ({
    default: module.MyAllocationsPage,
  }))
)

export const NewAllocationPage = lazy(() =>
  import("@/pages/allocations/NewAllocationPage").then((module) => ({
    default: module.NewAllocationPage,
  }))
)

// Approvals
export const ApprovalsPage = lazy(() =>
  import("@/pages/approvals/ApprovalsPage").then((module) => ({
    default: module.ApprovalsPage,
  }))
)

// Fulfillment
export const FulfillmentPage = lazy(() =>
  import("@/pages/fulfillment/FulfillmentPage").then((module) => ({
    default: module.FulfillmentPage,
  }))
)

//Auth Pages
export const LoginPage = lazy(() =>
  import("@/pages/Auth/LoginPage").then((module) => ({ default: module.LoginPage }))
)

//Error Pages
export const NotFound = lazy(() =>
  import("@/pages/common/NotFound").then((module) => ({ default: module.NotFound }))
)
