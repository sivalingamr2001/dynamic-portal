import { lazy } from "react"

// Layout
export { AppLayout } from "../layout/AppLayout"
export { AuthLayout } from "../layout/AuthLayout"
export { ProtectedLayout } from "../layout/ProtectedLayout"

// Pages
export const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  }))
)
export const LoginPage = lazy(() =>
  import("../pages/LoginPage").then((module) => ({ default: module.LoginPage }))
)
export const NotFound = lazy(() =>
  import("../pages/NotFound").then((module) => ({ default: module.NotFound }))
)
export const OrderEntry = lazy(() =>
  import("../pages/orderEntry").then((module) => ({
    default: module.OrderEntry,
  }))
)
export const HodApproval = lazy(() =>
  import("../pages/hodApproval").then((module) => ({
    default: module.hodApproval,
  }))
)
