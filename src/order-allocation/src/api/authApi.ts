import { axiosClient } from "@/lib/axiosClient"

export const loginApi = async (username: string, password?: string) => {
  const response = await axiosClient.post("/Auth/login", { username, password })
  return response.data
}

export const logoutApi = async (): Promise<{ success: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { success: true }
}
