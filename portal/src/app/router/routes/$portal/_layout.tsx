// src/app/router/routes/$portal/_layout.tsx
import { Suspense, useEffect } from "react";
import { createFileRoute, Outlet, useParams, redirect } from "@tanstack/react-router";
import { isValidPortal, loadPortal } from "../../../../portals/registry";
import { GlobalLoadingSpinner } from "../../../../shared/components";
import { PortalModule } from "../../../../shared/types/portal.types";
import { usePortalStore } from "../../../../store/portalStore";

export const Route = createFileRoute("/$portal/_layout")({
  beforeLoad: async ({ params, context }) => {
    const { portal } = params;

    // Guard: portal must exist
    if (!isValidPortal(portal)) {
      throw redirect({ to: "/" });
    }

    // Guard: must be authenticated
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { redirect: `/${portal}` },
      });
    }

    // Guard: must have portal access
    if (!context.auth.hasPortalAccess(portal)) {
      throw redirect({ to: "/unauthorized" });
    }

    // Pre-load portal for route context
    const portalModule = await loadPortal(portal);
    return { portalModule };
  },

  component: PortalLayoutWrapper,
});

function PortalLayoutWrapper() {
  const { portal } = useParams({ from: "/$portal/_layout" });
  const { portalModule } = Route.useRouteContext();
  const setCurrentPortal = usePortalStore((s) => s.setCurrentPortal);

  useEffect(() => {
    setCurrentPortal(portal, portalModule as PortalModule);
  }, [portal, portalModule, setCurrentPortal]);

  const Layout = (portalModule as PortalModule).layout;

  return (
    <Layout>
      <Suspense fallback={<GlobalLoadingSpinner />}>
        <Outlet />
      </Suspense>
    </Layout>
  );
}
