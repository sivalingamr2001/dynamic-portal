// src/portals/admin/index.ts
import { lazy } from "react";
import { PortalModule } from "@shared/types/portal.types";
import { PERMISSIONS } from "@constants/permissions";
import { ROLES } from "@constants/roles";
import { AdminLayout } from "./layouts/AdminLayout";

const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));

const adminPortal: PortalModule = {
  name: "admin",
  displayName: "Administration",
  description: "Manage users, roles, and system settings",
  version: "1.0.0",
  layout: AdminLayout,
  routes: [
    { path: "", label: "Dashboard", component: AdminDashboard, index: true },
    {
      path: "users",
      label: "Users",
      component: Users,
      requiredPermissions: [PERMISSIONS.USERS_MANAGE],
      requiredRoles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
    },
    {
      path: "settings",
      label: "Settings",
      component: Settings,
      requiredPermissions: [PERMISSIONS.SETTINGS_MANAGE],
      requiredRoles: [ROLES.SUPER_ADMIN],
    },
  ],
  navItems: [
    { label: "Dashboard", path: "/admin" },
    { label: "Users", path: "/admin/users", requiredPermissions: [PERMISSIONS.USERS_MANAGE] },
    {
      label: "Settings",
      path: "/admin/settings",
      requiredPermissions: [PERMISSIONS.SETTINGS_MANAGE],
    },
  ],
  requiredRoles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
  theme: { primaryColor: "#8b5cf6", accentColor: "#ec4899", sidebarVariant: "dark" },
};

export default adminPortal;
