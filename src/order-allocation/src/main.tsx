import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ThemeProvider } from "@/components/theme-provider.tsx"
import App from "./App.tsx"
import { SidebarProvider } from "./components/ui/sidebar.tsx"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>
)
