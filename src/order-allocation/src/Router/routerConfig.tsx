import { ProtectedLayout } from "@/layout/ProtectedLayout"
import type { RouteObject } from "react-router-dom"
import * as Pages from "./Pages"
import { withSuspense } from "./withSuspense"
import { NotFound } from "@/pages/common/NotFound"

export const routesConfig: RouteObject[] = [
  {
    element: <ProtectedLayout />,
    errorElement: <NotFound />,
    children: [
      {
        element: withSuspense(Pages.AppLayout),
        errorElement: withSuspense(Pages.NotFound),
        children: [
          //Dashboard
          {
            index: true,
            element: withSuspense(Pages.DashboardPage),
            path: "/dashboard",
          },

          //Admin
          {
            element: withSuspense(Pages.AuditLogsPage),
            path: "/admin/audit"
          },
          {
            element: withSuspense(Pages.ConfigPage),
            path: "/admin/config"
          },
          {
            element: withSuspense(Pages.RolesPage),
            path: "/admin/roles"
          },
          //Allocations
          {
            element: withSuspense(Pages.MyAllocationsPage),
            path: "/allocations/list"
          },
          {
            element: withSuspense(Pages.NewAllocationPage),
            path: "/allocations/new"
          },
          //Approvals
          {
            element: withSuspense(Pages.ApprovalsPage),
            path: "/approvals"
          },
          //Fulfillment
          {
            element: withSuspense(Pages.FulfillmentPage),
            path: "/fulfillment"
          }
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
