// src/shared/types/portal.types.ts
import React from "react";
import { Role } from "@constants/roles";
import { Permission } from "@constants/permissions";

export interface RouteDefinition {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType>;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  requiredRoles?: Role[];
  requiredPermissions?: Permission[];
  children?: RouteDefinition[];
  index?: boolean;
}

export interface PortalModule {
  name: string;
  displayName: string;
  description: string;
  version: string;
  icon?: React.ComponentType<{ className?: string }>;
  routes: RouteDefinition[];
  layout: React.ComponentType<{ children: React.ReactNode }>;
  requiredRoles?: Role[];
  requiredPermissions?: Permission[];
  navItems: NavItem[];
  theme?: PortalTheme;
}

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
  requiredPermissions?: Permission[];
}

export interface PortalTheme {
  primaryColor: string;
  accentColor: string;
  sidebarVariant: "light" | "dark" | "colored";
}

export interface PortalRegistry {
  [portalKey: string]: () => Promise<{ default: PortalModule }>;
}

export interface LoadedPortal {
  key: string;
  module: PortalModule;
}
