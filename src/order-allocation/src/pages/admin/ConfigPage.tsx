import { useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  Loader2,
  RefreshCw,
  RotateCcw,
  Save,
  Settings2,
} from "lucide-react"
import { toast } from "sonner"

import type { NavItem, PortalConfig, UserRole } from "@/config/portalConfig.types"
import { usePortalConfig } from "@/context/PortalConfigContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { JsonSectionEditor } from "@/pages/admin/config/JsonSectionEditor"

const USER_ROLES: UserRole[] = ["Admin", "Hod", "User"]

function configsEqual(a: PortalConfig, b: PortalConfig): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

export const ConfigPage = () => {
  const {
    config,
    appId,
    isLoading,
    isSaving,
    error,
    updateConfig,
    saveConfig,
    resetConfig,
    reloadConfig,
  } = usePortalConfig()

  const [draft, setDraft] = useState<PortalConfig>(config)
  const [fullJson, setFullJson] = useState(() => JSON.stringify(config, null, 2))
  const [fullJsonError, setFullJsonError] = useState<string | null>(null)

  useEffect(() => {
    setDraft(config)
    setFullJson(JSON.stringify(config, null, 2))
    setFullJsonError(null)
  }, [config])

  const isDirty = useMemo(() => !configsEqual(draft, config), [draft, config])

  const patchDraft = (updater: (previous: PortalConfig) => PortalConfig) => {
    setDraft((previous) => updater(previous))
  }

  const handleSave = async () => {
    try {
      updateConfig(draft)
      await saveConfig(draft)
      toast.success("Configuration saved", {
        description: `Settings for app "${appId}" are now active.`,
      })
    } catch {
      toast.error("Failed to save configuration")
    }
  }

  const handleReset = async () => {
    try {
      await resetConfig()
      toast.success("Configuration reset to defaults")
    } catch {
      toast.error("Failed to reset configuration")
    }
  }

  const handleReload = async () => {
    try {
      await reloadConfig()
      toast.success("Configuration reloaded")
    } catch {
      toast.error("Failed to reload configuration")
    }
  }

  const applyFullJson = () => {
    try {
      const parsed = JSON.parse(fullJson) as PortalConfig
      setDraft(parsed)
      setFullJsonError(null)
      toast.message("JSON applied to draft", {
        description: "Save to persist changes across the app.",
      })
    } catch {
      setFullJsonError("Invalid JSON. Fix syntax errors before applying.")
    }
  }

  const updateNavItem = (
    index: number,
    field: keyof NavItem,
    value: string
  ) => {
    patchDraft((previous) => {
      const primary = [...previous.navigation.primary]
      const item = { ...primary[index] }

      if (field === "roles") {
        item.roles = value
          .split(",")
          .map((role) => role.trim())
          .filter(Boolean) as UserRole[]
      } else {
        ;(item as Record<string, unknown>)[field] = value
      }

      primary[index] = item
      return {
        ...previous,
        navigation: { primary },
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading configuration...</span>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <div className="flex flex-shrink-0 flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Portal Configuration</h2>
            {isDirty ? (
              <Badge variant="outline" className="text-amber-600">
                Unsaved changes
              </Badge>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            Manage labels, navigation, tables, and API settings for the entire
            portal. Config is loaded by appId and will move to the database
            later.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="secondary">App ID: {appId}</Badge>
            <Badge variant="outline">Source: JSON + local override</Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handleReload()}
            disabled={isSaving}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reload
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handleReset()}
            disabled={isSaving}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset defaults
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => void handleSave()}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            Save changes
          </Button>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      ) : null}

      <Tabs
        defaultValue="general"
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden"
      >
        <TabsList className="h-auto w-full flex-shrink-0 flex-wrap justify-start">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="statuses">Statuses</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="data">Reference Data</TabsTrigger>
          <TabsTrigger value="json">Full JSON</TabsTrigger>
        </TabsList>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <TabsContent value="general" className="mt-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Application</CardTitle>
                <CardDescription>
                  Branding and metadata shown across the portal shell.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="app-name">App name</Label>
                  <Input
                    id="app-name"
                    value={draft.app.name}
                    onChange={(event) =>
                      patchDraft((previous) => ({
                        ...previous,
                        app: { ...previous.app, name: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-version">Version</Label>
                  <Input
                    id="app-version"
                    value={draft.app.version}
                    onChange={(event) =>
                      patchDraft((previous) => ({
                        ...previous,
                        app: { ...previous.app, version: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="app-description">Description</Label>
                  <Textarea
                    id="app-description"
                    value={draft.app.description}
                    onChange={(event) =>
                      patchDraft((previous) => ({
                        ...previous,
                        app: {
                          ...previous.app,
                          description: event.target.value,
                        },
                      }))
                    }
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="app-logo">Logo URL</Label>
                  <Input
                    id="app-logo"
                    value={draft.app.logo}
                    onChange={(event) =>
                      patchDraft((previous) => ({
                        ...previous,
                        app: { ...previous.app, logo: event.target.value },
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="mt-0 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API settings</CardTitle>
                <CardDescription>
                  Base URL and endpoint paths used by data services.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-base-url">Base URL</Label>
                  <Input
                    id="api-base-url"
                    value={draft.api.baseUrl}
                    onChange={(event) =>
                      patchDraft((previous) => ({
                        ...previous,
                        api: { ...previous.api, baseUrl: event.target.value },
                      }))
                    }
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(draft.api.endpoints).map(([key, path]) => (
                    <div key={key} className="space-y-2">
                      <Label htmlFor={`endpoint-${key}`}>{key}</Label>
                      <Input
                        id={`endpoint-${key}`}
                        value={path}
                        onChange={(event) =>
                          patchDraft((previous) => ({
                            ...previous,
                            api: {
                              ...previous.api,
                              endpoints: {
                                ...previous.api.endpoints,
                                [key]: event.target.value,
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="navigation" className="mt-0 space-y-4">
            {draft.navigation.primary.map((item, index) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.label}</CardTitle>
                  <CardDescription>Route: /{item.path}</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Label</Label>
                    <Input
                      value={item.label}
                      onChange={(event) =>
                        updateNavItem(index, "label", event.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Path</Label>
                    <Input
                      value={item.path}
                      onChange={(event) =>
                        updateNavItem(index, "path", event.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Icon (Lucide name)</Label>
                    <Input
                      value={item.icon}
                      onChange={(event) =>
                        updateNavItem(index, "icon", event.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Roles (comma-separated)</Label>
                    <Input
                      value={item.roles.join(", ")}
                      onChange={(event) =>
                        updateNavItem(index, "roles", event.target.value)
                      }
                      placeholder={USER_ROLES.join(", ")}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Description</Label>
                    <Input
                      value={item.description}
                      onChange={(event) =>
                        updateNavItem(index, "description", event.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="forms" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <JsonSectionEditor
                  title="Form field configuration"
                  description="Labels, placeholders, required flags, and select options for allocation, approval, and cancellation forms."
                  value={draft.forms}
                  onChange={(forms) =>
                    patchDraft((previous) => ({ ...previous, forms }))
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tables" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <JsonSectionEditor
                  title="Table column configuration"
                  description="Column keys, labels, and widths for allocation, approval, and fulfillment grids."
                  value={draft.tables}
                  onChange={(tables) =>
                    patchDraft((previous) => ({ ...previous, tables }))
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statuses" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <JsonSectionEditor
                  title="Status badges"
                  description="Request and line status labels, colors, and icons."
                  value={draft.statuses}
                  onChange={(statuses) =>
                    patchDraft((previous) => ({ ...previous, statuses }))
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="mt-0">
            <Card>
              <CardContent className="pt-6">
                <JsonSectionEditor
                  title="Roles and permissions"
                  description="Role display labels and permission keys used for access control."
                  value={draft.roles}
                  onChange={(roles) =>
                    patchDraft((previous) => ({ ...previous, roles }))
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-0 space-y-4">
            <Card>
              <CardContent className="pt-6">
                <JsonSectionEditor
                  title="Territories"
                  value={draft.territories}
                  onChange={(territories) =>
                    patchDraft((previous) => ({ ...previous, territories }))
                  }
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <JsonSectionEditor
                  title="Warehouses"
                  value={draft.warehouses}
                  onChange={(warehouses) =>
                    patchDraft((previous) => ({ ...previous, warehouses }))
                  }
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <JsonSectionEditor
                  title="Cancellation reasons"
                  value={draft.cancellationReasons}
                  onChange={(cancellationReasons) =>
                    patchDraft((previous) => ({
                      ...previous,
                      cancellationReasons,
                    }))
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="json" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Full configuration JSON</CardTitle>
                <CardDescription>
                  Edit the complete portal config object. Useful for bulk changes
                  or copying between environments.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={fullJson}
                  onChange={(event) => {
                    setFullJson(event.target.value)
                    setFullJsonError(null)
                  }}
                  className="min-h-[420px] font-mono text-xs"
                  spellCheck={false}
                />
                {fullJsonError ? (
                  <p className="text-xs text-destructive">{fullJsonError}</p>
                ) : null}
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={applyFullJson}>
                    Apply to draft
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setFullJson(JSON.stringify(draft, null, 2))
                      setFullJsonError(null)
                    }}
                  >
                    Sync from draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
