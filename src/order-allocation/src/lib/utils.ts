import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Logo from "@/assets/jana.png"

export default Logo

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ENV_CONFIG = {
  BASE_API_URL: import.meta.env.DEV
    ? import.meta.env.VITE_BASE_API_URL
    : "/portal/api",
}

export const getUserId = () => {
  try {
    const rawData: any = sessionStorage.getItem("jan_AP_user")
    const session = JSON.parse(rawData)
    const userId: number | null =
      session?.user?.id ?? session?.id ?? session?.value?.user?.id
    return userId ?? null
  } catch (error) {
    console.error("Error parsing user session data:", error)
    return null
  }
}
