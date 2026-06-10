// src/portals/admin/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@api/queryKeys";
import { adminService, AdminUser } from "../services/adminService";

export const useUsers = () =>
  useQuery({
    queryKey: queryKeys.admin.users(),
    queryFn: adminService.getUsers,
  });

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminUser> }) =>
      adminService.updateUser(id, data),
    onSuccess: (updated) => {
      qc.setQueryData<AdminUser[]>(queryKeys.admin.users(), (old = []) =>
        old.map((u) => (u.id === updated.id ? updated : u))
      );
    },
  });
};
