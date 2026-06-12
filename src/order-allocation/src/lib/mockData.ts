import type { UserDetails } from "@/api/types";

export const MOCK_USERS: Record<string, UserDetails> = {
  "admin@company.com": {
    id: 1,
    name: "Sarah Jenkins",
    employeeId: "E001",
    email: "admin@company.com",
    mobileNumber: "9876543210",
    departmentId: 101,
    role: "Admin",
    location: "Headquarters",
    isActive: true,
  },
  "hod@company.com": {
    id: 2,
    name: "Dr. Aris Vance",
    employeeId: "E002",
    email: "hod@company.com",
    mobileNumber: "9876543211",
    departmentId: 102,
    role: "Hod",
    location: "Regional Office",
    isActive: true,
  },
  "user@company.com": {
    id: 3,
    name: "Alex Rivera",
    employeeId: "E003",
    email: "user@company.com",
    mobileNumber: null,
    departmentId: 103,
    role: "User",
    location: "Remote",
    isActive: true,
  },
}