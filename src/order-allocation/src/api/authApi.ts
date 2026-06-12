import { MOCK_USERS } from "@/lib/mockData"
import type { UserDetails } from "./types"

const ROLE_PASSWORDS: Record<string, string> = {
  Admin: "Admin@123",
  Hod: "Hod@123",
  User: "User@123",
}

export const loginApi = async (
  username: string,
  password?: string
): Promise<UserDetails> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const cleanUsername = username.trim().toLowerCase()
  const cleanPassword = password?.trim() || ""

  if (!cleanUsername) {
    throw new Error("Username is required.")
  }
  if (!cleanPassword) {
    throw new Error("Password is required.")
  }

  const user = MOCK_USERS[cleanUsername]

  if (!user) {
    throw new Error("Invalid username or password.")
  }

  const requiredPassword = ROLE_PASSWORDS[user.role]

  if (cleanPassword !== requiredPassword) {
    throw new Error("Invalid username or password.")
  }

  return user
}

export const logoutApi = async (): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true }
}
