import type { PortalConfig } from "@/config/portalConfig.types"
import { defaultPortalConfig } from "@/config/portalConfig"

const CONFIG_STORAGE_PREFIX = "portal_config"

export function getConfigStorageKey(appId: string): string {
  return `${CONFIG_STORAGE_PREFIX}_${appId}`
}

export function getAppId(): string {
  return import.meta.env.VITE_APP_ID ?? "order-allocation-sales"
}

function cloneDefaultConfig(): PortalConfig {
  return structuredClone(defaultPortalConfig)
}

/**
 * Loads portal configuration for the given appId.
 * Today: local JSON default + optional localStorage overrides.
 * Future: replace the mock branch with `GET /apps/:appId/config`.
 */
export async function fetchPortalConfigByAppId(
  appId: string
): Promise<PortalConfig> {
  try {
  // const response = await apiService.get<PortalConfig>(`/apps/${appId}/config`)
  // return response

    const stored = localStorage.getItem(getConfigStorageKey(appId))
    if (stored) {
      return JSON.parse(stored) as PortalConfig
    }
  } catch (error) {
    console.error(`Failed to load config for appId "${appId}":`, error)
  }

  return cloneDefaultConfig()
}

/**
 * Persists portal configuration for the given appId.
 * Today: localStorage. Future: `PUT /apps/:appId/config`.
 */
export async function savePortalConfigByAppId(
  appId: string,
  config: PortalConfig
): Promise<void> {
  // await apiService.put(`/apps/${appId}/config`, config)
  localStorage.setItem(getConfigStorageKey(appId), JSON.stringify(config))
}

export async function clearPortalConfigOverride(appId: string): Promise<void> {
  // await apiService.delete(`/apps/${appId}/config/override`)
  localStorage.removeItem(getConfigStorageKey(appId))
}
