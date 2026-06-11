import { ProtectedLayout } from "@/layout/ProtectedLayout"
import { NotFound } from "@/pages/NotFound"
import type { RouteObject } from "react-router-dom"
import * as Pages from "./Pages"
import { withSuspense } from "./withSuspense"

export const routesConfig: RouteObject[] = [
  {
    element: <ProtectedLayout />,
    errorElement: <NotFound />,
    children: [
      {
        element: withSuspense(Pages.AppLayout),
        errorElement: withSuspense(Pages.NotFound),
        children: [
          {
            index: true,
            element: withSuspense(Pages.DashboardPage),
            path: "/dashboard",
          },
          {
            element: withSuspense(Pages.OrderEntry),
            path: "/orders",
          },
          {
            element: withSuspense(Pages.HodApproval),
            path: "/approvals",
          },
        ],
      },
    ],
  },
  {
    element: withSuspense(Pages.AuthLayout),
    errorElement: withSuspense(Pages.NotFound),
    children: [
      {
        index: true,
        element: withSuspense(Pages.LoginPage),
        path: "/login",
      },
    ],
  },
]
