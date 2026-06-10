// src/portals/finance/services/financeService.ts
import { api } from "@api/httpClient";

export interface Report {
  id: string;
  name: string;
  type: string;
  period: string;
  status: "ready" | "generating" | "failed";
  generatedAt: string;
}

export interface Invoice {
  id: string;
  client: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
}

export const financeService = {
  getReports: (): Promise<Report[]> => api.get<Report[]>("/finance/reports"),
  getReport: (id: string): Promise<Report> => api.get<Report>(`/finance/reports/${id}`),
  getInvoices: (): Promise<Invoice[]> => api.get<Invoice[]>("/finance/invoices"),
  createInvoice: (data: Omit<Invoice, "id">): Promise<Invoice> =>
    api.post<Invoice>("/finance/invoices", data),
};
