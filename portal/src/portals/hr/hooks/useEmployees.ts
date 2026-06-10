// src/portals/hr/hooks/useEmployees.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@api/queryKeys";
import { hrService, Employee } from "../services/hrService";

export const useEmployees = () =>
  useQuery({
    queryKey: queryKeys.hr.employees(),
    queryFn: hrService.getEmployees,
    staleTime: 1000 * 60 * 5,
  });

export const useEmployee = (id: string) =>
  useQuery({
    queryKey: queryKeys.hr.employee(id),
    queryFn: () => hrService.getEmployee(id),
    enabled: !!id,
  });

export const useCreateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: hrService.createEmployee,
    onSuccess: (newEmployee) => {
      qc.setQueryData<Employee[]>(queryKeys.hr.employees(), (old = []) => [...old, newEmployee]);
    },
  });
};

export const useUpdateEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Employee> }) =>
      hrService.updateEmployee(id, data),
    onSuccess: (updated) => {
      qc.setQueryData<Employee[]>(queryKeys.hr.employees(), (old = []) =>
        old.map((e) => (e.id === updated.id ? updated : e))
      );
      qc.setQueryData(queryKeys.hr.employee(updated.id), updated);
    },
  });
};

export const useDeleteEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: hrService.deleteEmployee,
    onSuccess: (_, deletedId) => {
      qc.setQueryData<Employee[]>(queryKeys.hr.employees(), (old = []) =>
        old.filter((e) => e.id !== deletedId)
      );
    },
  });
};
