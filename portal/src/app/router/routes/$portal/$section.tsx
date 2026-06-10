// src/app/router/routes/$portal/$section.tsx
import { Suspense } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { GlobalLoadingSpinner } from "../../../../shared/components";
import { PortalModule, RouteDefinition } from "../../../../shared/types/portal.types";

export const Route = createFileRoute("/$portal/$section")({
  component: PortalSection,

  beforeLoad: ({ params, context }) => {
    const { portalModule } = context as unknown as { portalModule: PortalModule };
    const { section } = params;

    const routeDef = portalModule?.routes.find((r) => r.path === section);
    if (!routeDef) throw notFound();

    // Role check
    const auth = context.auth;
    if (routeDef.requiredRoles?.length) {
      const hasRole = routeDef.requiredRoles.some((r) => auth.hasRole(r));
      if (!hasRole) throw notFound(); // Return 404 to avoid leaking route names
    }

    // Permission check
    if (routeDef.requiredPermissions?.length) {
      const hasPerm = routeDef.requiredPermissions.some((p) => auth.hasPermission(p));
      if (!hasPerm) throw notFound();
    }

    return { routeDef };
  },
});

function PortalSection() {
  const { routeDef } = Route.useRouteContext() as {
    routeDef: RouteDefinition;
  };

  const SectionComponent = routeDef.component;

  return (
    <Suspense fallback={<GlobalLoadingSpinner />}>
      <SectionComponent />
    </Suspense>
  );
}
