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

export const AllocationDetailsPage = lazy(() =>
  import("@/pages/allocations/AllocationDetailsPageV2").then((module) => ({
    default: module.AllocationDetailsPageV2,
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
