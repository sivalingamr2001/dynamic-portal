import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AppHeader } from "./AppHeader"
import { AppSidebar } from "./AppSidebar"
import portalConfig from "@/config/portalConfig"
import { Sheet, SheetContent } from "@/components/ui/sheet"

export const AppLayout = () => {
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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
    <div className="w-full h-screen bg-background flex overflow-hidden">

      {/* 1. DESKTOP SIDEBAR CONTAINER FRAME */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 border-r border-border bg-card z-20">
        <AppSidebar />
      </div>

      {/* 2. MOBILE SIDEBAR NAVIGATION DRAWER */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-card border-r border-border">
          <AppSidebar />
        </SheetContent>
      </Sheet>

      {/* 3. BOUNDED ACTIVE VIEWPORT FRAME */}
      <div className="w-full h-screen lg:pl-64 flex flex-col min-h-0 overflow-hidden">
        
        {/* Layout Non-Shrinkable Navigation Header Component */}
        <div className="flex-shrink-0 w-full p-3 md:p-4 lg:p-5 pb-0 lg:pb-0">
          <AppHeader
            title={title}
            description={description}
            onMenuClick={() => setIsMobileOpen(true)}
          />
        </div>

        {/* Bounded Scroll-Lock Sandbox Canvas */}
        <main className="flex-1 w-full p-3 md:p-4 lg:p-5 min-h-0 flex flex-col overflow-hidden">
          <div key={location.pathname} className="flex-1 w-full min-h-0 animate-slide-in-up">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}
