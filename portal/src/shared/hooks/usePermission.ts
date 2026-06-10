// src/shared/hooks/usePermission.ts
import { useAuthStore } from "@store/authStore";
import { Permission } from "@constants/permissions";
import { Role } from "@constants/roles";

export const usePermission = () => {
  const { hasRole, hasPermission, hasPortalAccess, user, isAuthenticated } = useAuthStore();

  return {
    isAuthenticated,
    user,
    hasRole: (role: Role) => hasRole(role),
    hasPermission: (permission: Permission) => hasPermission(permission),
    hasAnyPermission: (permissions: Permission[]) => permissions.some(hasPermission),
    hasAllPermissions: (permissions: Permission[]) => permissions.every(hasPermission),
    hasPortalAccess: (portal: string) => hasPortalAccess(portal),
    canAccess: (opts: { roles?: Role[]; permissions?: Permission[] }) => {
      if (opts.roles?.length && !opts.roles.some(hasRole)) return false;
      if (opts.permissions?.length && !opts.permissions.some(hasPermission)) return false;
      return true;
    },
  };
};
