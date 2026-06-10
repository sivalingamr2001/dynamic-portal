// src/portals/hr/services/hrService.ts
import { api } from "@api/httpClient";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "active" | "inactive" | "on_leave";
  startDate: string;
  salary: number;
  managerId?: string;
}

export interface PayrollRecord {
  id: string;
  employee: string;
  period: string;
  gross: number;
  deductions: number;
  net: number;
  status: "paid" | "pending" | "processing";
}

export const hrService = {
  getEmployees: (): Promise<Employee[]> => api.get<Employee[]>("/hr/employees"),

  getEmployee: (id: string): Promise<Employee> => api.get<Employee>(`/hr/employees/${id}`),

  createEmployee: (data: Omit<Employee, "id">): Promise<Employee> =>
    api.post<Employee>("/hr/employees", data),

  updateEmployee: (id: string, data: Partial<Employee>): Promise<Employee> =>
    api.patch<Employee>(`/hr/employees/${id}`, data),

  deleteEmployee: (id: string): Promise<void> => api.delete(`/hr/employees/${id}`),

  getPayroll: (): Promise<PayrollRecord[]> => api.get<PayrollRecord[]>("/hr/payroll"),
};
