import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import {
  clearPortalConfigOverride,
  fetchPortalConfigByAppId,
  getAppId,
  savePortalConfigByAppId,
} from "@/api/configApi"
import { defaultPortalConfig } from "@/config/portalConfig"
import type { PortalConfig } from "@/config/portalConfig.types"

type PortalConfigContextValue = {
  config: PortalConfig
  appId: string
  isLoading: boolean
  isSaving: boolean
  error: string | null
  updateConfig: (
    updater: PortalConfig | ((previous: PortalConfig) => PortalConfig)
  ) => void
  saveConfig: (nextConfig?: PortalConfig) => Promise<void>
  resetConfig: () => Promise<void>
  reloadConfig: () => Promise<void>
}

const PortalConfigContext = createContext<PortalConfigContextValue | null>(null)

export function PortalConfigProvider({ children }: { children: ReactNode }) {
  const appId = getAppId()
  const [config, setConfig] = useState<PortalConfig>(defaultPortalConfig)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadConfig = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const loaded = await fetchPortalConfigByAppId(appId)
      setConfig(loaded)
    } catch (loadError) {
      console.error("Portal config load failed:", loadError)
      setError("Failed to load portal configuration.")
      setConfig(structuredClone(defaultPortalConfig))
    } finally {
      setIsLoading(false)
    }
  }, [appId])

  useEffect(() => {
    void loadConfig()
  }, [loadConfig])

  const updateConfig = useCallback(
    (updater: PortalConfig | ((previous: PortalConfig) => PortalConfig)) => {
      setConfig((previous) =>
        typeof updater === "function" ? updater(previous) : updater
      )
      setError(null)
    },
    []
  )

  const saveConfig = useCallback(
    async (nextConfig?: PortalConfig) => {
      setIsSaving(true)
      setError(null)

      try {
        const payload = nextConfig ?? config
        await savePortalConfigByAppId(appId, payload)
        setConfig(payload)
      } catch (saveError) {
        console.error("Portal config save failed:", saveError)
        setError("Failed to save portal configuration.")
        throw saveError
      } finally {
        setIsSaving(false)
      }
    },
    [appId, config]
  )

  const resetConfig = useCallback(async () => {
    setIsSaving(true)
    setError(null)

    try {
      await clearPortalConfigOverride(appId)
      const fresh = structuredClone(defaultPortalConfig)
      setConfig(fresh)
    } catch (resetError) {
      console.error("Portal config reset failed:", resetError)
      setError("Failed to reset portal configuration.")
      throw resetError
    } finally {
      setIsSaving(false)
    }
  }, [appId])

  const value = useMemo(
    () => ({
      config,
      appId,
      isLoading,
      isSaving,
      error,
      updateConfig,
      saveConfig,
      resetConfig,
      reloadConfig: loadConfig,
    }),
    [
      config,
      appId,
      isLoading,
      isSaving,
      error,
      updateConfig,
      saveConfig,
      resetConfig,
      loadConfig,
    ]
  )

  return (
    <PortalConfigContext.Provider value={value}>
      {children}
    </PortalConfigContext.Provider>
  )
}

export function usePortalConfig() {
  const context = useContext(PortalConfigContext)
  if (!context) {
    throw new Error("usePortalConfig must be used within PortalConfigProvider")
  }
  return context
}
