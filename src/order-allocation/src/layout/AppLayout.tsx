import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AppHeader } from "./AppHeader"
import { AppSidebar } from "./AppSidebar"
import portalConfig from "@/config/portalConfig"
import { Sheet, SheetContent } from "@/components/ui/sheet" // Import Shadcn sheet component

export const AppLayout = () => {
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Auto-close the mobile sheet whenever the route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  const activeRoute = portalConfig.navigation.primary.find((item) => {
    const currentPath = location.pathname.replace(/^\/|\/$/g, '')
    const cleanItemPath = item.path.replace(/^\/|\/$/g, '')
    return currentPath === cleanItemPath
  })

  const title = activeRoute?.label || "Dashboard"
  const description = (activeRoute as any)?.description || ""

  return (
    <div className="w-full min-h-screen bg-background flex">
      
      {/* 1. DESKTOP SIDEBAR: Hidden on mobile, fixed width on desktop */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r border-border bg-card z-20">
        <AppSidebar />
      </div>

      {/* 2. MOBILE DRAWER SIDEBAR: Managed by Shadcn primitives */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-card border-r border-border">
          <AppSidebar />
        </SheetContent>
      </Sheet>

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="w-full min-h-screen lg:pl-64 flex flex-col">
        <div className="w-full p-3 md:p-4 lg:p-5 pb-0 lg:pb-0">
          <AppHeader 
            title={title} 
            description={description} 
            onMenuClick={() => setIsMobileOpen(true)} 
          />
        </div>

        <main className="flex-1 w-full p-3 md:p-4 lg:p-5">
          <div key={location.pathname} className="space-y-3 md:space-y-4 animate-slide-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
