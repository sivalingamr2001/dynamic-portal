import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ThemeProvider } from "@/context/ThemeContext.tsx"
import App from "./App.tsx"
import { SidebarProvider } from "./components/ui/sidebar.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import "./index.css"
import { AuthProvider } from "./context/AuthContext.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <SidebarProvider>
            <App />
          </SidebarProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
