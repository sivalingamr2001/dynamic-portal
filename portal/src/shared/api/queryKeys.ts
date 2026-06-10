export const queryKeys = {
  // Auth
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },

  // HR
  hr: {
    all: ["hr"] as const,
    employees: () => [...queryKeys.hr.all, "employees"] as const,
    employee: (id: string) => [...queryKeys.hr.employees(), id] as const,
    payroll: () => [...queryKeys.hr.all, "payroll"] as const,
    payrollPeriod: (period: string) => [...queryKeys.hr.payroll(), period] as const,
  },

  // Finance
  finance: {
    all: ["finance"] as const,
    reports: () => [...queryKeys.finance.all, "reports"] as const,
    report: (id: string) => [...queryKeys.finance.reports(), id] as const,
    invoices: () => [...queryKeys.finance.all, "invoices"] as const,
    invoice: (id: string) => [...queryKeys.finance.invoices(), id] as const,
  },

  // Admin
  admin: {
    all: ["admin"] as const,
    users: () => [...queryKeys.admin.all, "users"] as const,
    user: (id: string) => [...queryKeys.admin.users(), id] as const,
    settings: () => [...queryKeys.admin.all, "settings"] as const,
    auditLog: () => [...queryKeys.admin.all, "auditLog"] as const,
  },
} as const;
