import { PortalModule } from "../shared/types/portal.types";

/**
 * Glob import: discovers all portal index.ts files automatically.
 * Adding a new portal requires ZERO router changes — just create the folder.
 */
const portalModules = import.meta.glob<{ default: PortalModule }>("./*/index.ts", { eager: false });

/**
 * Extracts portal key from glob path: "./hr/index.ts" → "hr"
 */
const extractPortalKey = (path: string): string => {
  const match = path.match(/\.\/([^/]+)\/index\.ts$/);
  if (!match?.[1]) throw new Error(`Invalid portal path: ${path}`);
  return match[1];
};

/**
 * Registry of lazy portal loaders, keyed by portal name.
 * e.g. { hr: () => import('./hr/index.ts'), finance: ..., admin: ... }
 */
export const portalRegistry: Record<string, () => Promise<{ default: PortalModule }>> =
  Object.fromEntries(
    Object.entries(portalModules).map(([path, loader]) => [extractPortalKey(path), loader])
  );

/**
 * Returns all known portal keys discovered at build time.
 */
export const getAvailablePortals = (): string[] => Object.keys(portalRegistry);

/**
 * Loads a portal module with caching. Throws if portal is not found.
 */
const _cache = new Map<string, PortalModule>();

export const loadPortal = async (portalKey: string): Promise<PortalModule> => {
  if (_cache.has(portalKey)) {
    return _cache.get(portalKey)!;
  }

  const loader = portalRegistry[portalKey];
  if (!loader) {
    throw new Error(
      `Portal "${portalKey}" not found. Available: ${getAvailablePortals().join(", ")}`
    );
  }

  const { default: module } = await loader();
  _cache.set(portalKey, module);
  return module;
};

/**
 * Type-safe check for portal existence.
 */
export const isValidPortal = (key: string): boolean => key in portalRegistry;
