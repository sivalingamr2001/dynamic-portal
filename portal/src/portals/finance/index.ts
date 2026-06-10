// src/portals/finance/index.ts
import React, { lazy } from "react";
import { PortalModule } from "@shared/types/portal.types";
import { PERMISSIONS } from "@constants/permissions";
import { FinanceLayout } from "./layouts/FinanceLayout";

const FinanceDashboard = lazy(() => import("./pages/FinanceDashboard"));
const Reports = lazy(() => import("./pages/Reports"));
const Invoices = lazy(() => import("./pages/Invoices"));

const financePortal: PortalModule = {
  name: "finance",
  displayName: "Finance",
  description: "Manage reports, invoices, and financial operations",
  version: "1.0.0",
  layout: FinanceLayout,
  routes: [
    { path: "", label: "Dashboard", component: FinanceDashboard, index: true },
    {
      path: "reports",
      label: "Reports",
      component: Reports,
      requiredPermissions: [PERMISSIONS.REPORTS_READ],
    },
    {
      path: "invoices",
      label: "Invoices",
      component: Invoices,
      requiredPermissions: [PERMISSIONS.FINANCE_READ],
    },
  ],
  navItems: [
    { label: "Dashboard", path: "/finance" },
    { label: "Reports", path: "/finance/reports" },
    { label: "Invoices", path: "/finance/invoices" },
  ],
  theme: {
    primaryColor: "#10b981",
    accentColor: "#f59e0b",
    sidebarVariant: "dark",
  },
};

export default financePortal;
