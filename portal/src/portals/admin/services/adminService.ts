// src/portals/admin/services/adminService.ts
import { api } from "@api/httpClient";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  portal: string;
  status: "active" | "inactive";
  lastActive: string;
}

export interface SystemSettings {
  appName: string;
  supportEmail: string;
  sessionTimeout: number;
  maxLoginAttempts: number;
}

export const adminService = {
  getUsers: (): Promise<AdminUser[]> => api.get<AdminUser[]>("/admin/users"),
  getUser: (id: string): Promise<AdminUser> => api.get<AdminUser>(`/admin/users/${id}`),
  createUser: (data: Omit<AdminUser, "id">): Promise<AdminUser> =>
    api.post<AdminUser>("/admin/users", data),
  updateUser: (id: string, data: Partial<AdminUser>): Promise<AdminUser> =>
    api.patch<AdminUser>(`/admin/users/${id}`, data),
  deleteUser: (id: string): Promise<void> => api.delete(`/admin/users/${id}`),
  getSettings: (): Promise<SystemSettings> => api.get<SystemSettings>("/admin/settings"),
  updateSettings: (data: Partial<SystemSettings>): Promise<SystemSettings> =>
    api.patch<SystemSettings>("/admin/settings", data),
};
