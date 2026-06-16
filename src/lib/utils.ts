import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ENV_CONFIG = {
  BASE_API_URL: import.meta.env.DEV
    ? import.meta.env.VITE_BASE_API_URL
    : "/portal/api",
}