import { AppLayout } from "@/Layout"
import { PortalProvider } from "@/store/portal-store"
import { Navigate, Route, Routes } from "react-router-dom"
import AllocationPage from "./pages/AllocationPage"
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
            <Route path="/allocation" element={<AllocationPage />} />
            {/* <Route path="/approval" element={<ApprovalPage />} />
            <Route path="/amendment" element={<AmendmentPage />} />
            <Route path="/fulfillment" element={<FulfillmentPage />} /> */}
            <Route path="*" element={<Navigate to="/allocation" replace />} />
          </Route>
        </Routes>
      </PortalProvider>
    </ThemeProvider>
  )
}
