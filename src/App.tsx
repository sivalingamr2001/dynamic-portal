import { AppLayout } from "@/Layout"
import { AmendmentPage } from "@/pages/AmendmentPage"
import { ApprovalPage } from "@/pages/ApprovalPage"
import { FulfillmentPage } from "@/pages/FulfillmentPage"
import { PortalProvider } from "@/store/portal-store"
import { Navigate, Route, Routes } from "react-router-dom"
import AllocationPageV2 from "./pages/AllocationPageV2"
import { DashboardPage } from "./pages/DashboardPage"
import { ThemeProvider } from "./store/theme-provider"

export default function App() {
  return (
    <ThemeProvider>
      <PortalProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/allocation" element={<AllocationPageV2 />} />
            <Route path="/approval" element={<ApprovalPage />} />
            <Route path="/amendment" element={<AmendmentPage />} />
            <Route path="/fulfillment" element={<FulfillmentPage />} />
            <Route path="*" element={<Navigate to="/allocation" replace />} />
          </Route>
        </Routes>
      </PortalProvider>
    </ThemeProvider>
  )
}
