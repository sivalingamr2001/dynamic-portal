// src/shared/constants/permissions.ts
import { Role, ROLES } from "./roles";

export const PERMISSIONS = {
  // HR
  HR_READ: "hr:read",
  HR_WRITE: "hr:write",
  HR_DELETE: "hr:delete",
  PAYROLL_READ: "payroll:read",
  PAYROLL_WRITE: "payroll:write",
  // Finance
  FINANCE_READ: "finance:read",
  FINANCE_WRITE: "finance:write",
  REPORTS_READ: "reports:read",
  INVOICES_WRITE: "invoices:write",
  // Admin
  USERS_MANAGE: "users:manage",
  SETTINGS_MANAGE: "settings:manage",
  PORTALS_MANAGE: "portals:manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [ROLES.ADMIN]: [
    PERMISSIONS.HR_READ,
    PERMISSIONS.FINANCE_READ,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.SETTINGS_MANAGE,
  ],
  [ROLES.HR_MANAGER]: [
    PERMISSIONS.HR_READ,
    PERMISSIONS.HR_WRITE,
    PERMISSIONS.HR_DELETE,
    PERMISSIONS.PAYROLL_READ,
    PERMISSIONS.PAYROLL_WRITE,
  ],
  [ROLES.HR_STAFF]: [PERMISSIONS.HR_READ, PERMISSIONS.PAYROLL_READ],
  [ROLES.FINANCE_MANAGER]: [
    PERMISSIONS.FINANCE_READ,
    PERMISSIONS.FINANCE_WRITE,
    PERMISSIONS.REPORTS_READ,
    PERMISSIONS.INVOICES_WRITE,
  ],
  [ROLES.FINANCE_STAFF]: [PERMISSIONS.FINANCE_READ, PERMISSIONS.REPORTS_READ],
  [ROLES.VIEWER]: [PERMISSIONS.HR_READ, PERMISSIONS.FINANCE_READ],
};
