// src/portals/hr/index.ts
import { lazy } from "react";
import { PERMISSIONS } from "../../shared/constants/permissions";
import { ROLES } from "../../shared/constants/roles";
import { PortalModule } from "../../shared/types/portal.types";
import { HRLayout } from "./layouts/HRLayout";

const HRDashboard = lazy(() => import("./pages/HRDashboard"));
const Employees = lazy(() => import("./pages/Employees"));
const Payroll = lazy(() => import("./pages/Payroll"));

const hrPortal: PortalModule = {
  name: "hr",
  displayName: "Human Resources",
  description: "Manage employees, payroll, and HR operations",
  version: "1.0.0",
  layout: HRLayout,
  routes: [
    {
      path: "",
      label: "Dashboard",
      component: HRDashboard,
      index: true,
    },
    {
      path: "employees",
      label: "Employees",
      component: Employees,
      requiredPermissions: [PERMISSIONS.HR_READ],
    },
    {
      path: "payroll",
      label: "Payroll",
      component: Payroll,
      requiredPermissions: [PERMISSIONS.PAYROLL_READ],
      requiredRoles: [ROLES.HR_MANAGER, ROLES.SUPER_ADMIN],
    },
  ],
  navItems: [
    { label: "Dashboard", path: "/hr" },
    {
      label: "Employees",
      path: "/hr/employees",
      requiredPermissions: [PERMISSIONS.HR_READ],
    },
    {
      label: "Payroll",
      path: "/hr/payroll",
      requiredPermissions: [PERMISSIONS.PAYROLL_READ],
    },
  ],
  theme: {
    primaryColor: "#3b82f6",
    accentColor: "#06b6d4",
    sidebarVariant: "light",
  },
};

export default hrPortal;
