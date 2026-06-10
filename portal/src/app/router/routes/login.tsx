import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../../shared/components";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
    const navigate = Route.useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold">Login</h1>
        <p className="mt-3 text-sm text-slate-600">Login is not yet implemented. Please contact your administrator.</p>
      </div>
      <Button onClick={() => navigate({ to: "/hr" as any})}
 className="ml-4">
        HR
      </Button>
    </div>
  );
}
