import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ThemeProvider } from "@/context/ThemeContext.tsx"
import App from "./App.tsx"
import { SidebarProvider } from "./components/ui/sidebar.tsx"
import { Toaster } from "./components/ui/sonner.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import "./index.css"
import { AuthProvider } from "./context/AuthContext.tsx"
import { PortalConfigProvider } from "./context/PortalConfigContext.tsx"
import { AgGridProvider } from "ag-grid-react"
import { AllCommunityModule } from "ag-grid-community"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <PortalConfigProvider>
          <AuthProvider>
            <SidebarProvider>
              <AgGridProvider modules={[AllCommunityModule]}>
                <App />
                <Toaster richColors position="top-right" />
              </AgGridProvider>
            </SidebarProvider>
          </AuthProvider>
        </PortalConfigProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
