// src/app/router/routes/$portal/index.tsx
import { createFileRoute, useParams } from "@tanstack/react-router";
import React, { Suspense } from "react";
import { Loader } from "../../../../shared/components/Loader";

export const Route = createFileRoute("/$portal/")({
  component: PortalDashboard,
});

function PortalDashboard() {
  const { portal } = useParams({ from: "/$portal/" });
  const { portalModule } = Route.useRouteContext() as {
    portalModule: {
      routes: Array<{ path: string; component: React.LazyExoticComponent<React.ComponentType> }>;
    };
  };

  // Find the index/dashboard route in this portal's route definitions
  const dashboardRoute = portalModule.routes.find((r) => r.path === "" || r.path === "dashboard");

  if (!dashboardRoute) {
    return (
      <div className="p-8 text-center text-slate-500">
        No dashboard configured for portal: {portal}
      </div>
    );
  }

  const DashboardComponent = dashboardRoute.component;

  return (
    <Suspense fallback={<Loader />}>
      <DashboardComponent />
    </Suspense>
  );
}
