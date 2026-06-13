"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import * as Icons from 'lucide-react'

import Logo, { cn } from "@/lib/utils"
import { usePortalConfig } from "@/context/PortalConfigContext"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

type IconKey = keyof typeof Icons;

export const AppSidebar = () => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const location = useLocation()
  const isMobile = typeof window !== "undefined" ? window.matchMedia("(max-width: 767px)").matches : false
  const { config } = usePortalConfig()
  const { app, navigation } = config

  return (
    // FIXED: Removed "hidden lg:flex" so the elements render inside your mobile drawer wrapper
    <aside className="w-full lg:w-64 bg-card p-3 h-full flex flex-col justify-between">

      {/* Top Section: Brand + Navigation wrapped inside a tight container */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {/* Brand Header */}
        <div className="flex w-full max-w-full items-center justify-center gap-3 overflow-hidden">
          {isMobile ? (
            <div className="flex w-full items-center gap-2.5 p-0 text-primary">
              <div className="flex h-9 w-9 items-center justify-center bg-primary/10 text-primary rounded-[6px]">
                <Icons.Package className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-foreground/90">{app.name}</p>
              </div>
            </div>
          ) : (
            <div className="flex w-full items-center gap-2.5 p-0 text-primary">
              <div className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-primary text-background shadow-sm shadow-primary/20">
                <Icons.Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <img
                  src={Logo}
                  alt="JANATICS"
                  className="h-3.5 w-auto animate-in object-contain duration-300 fade-in shrink-0"
                />
                <p className="truncate text-xs font-semibold text-foreground/90">{app.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
            Menu
          </p>
          <nav className="space-y-0.5">
            {navigation.primary.map((item) => {
              const currentPath = location.pathname.replace(/^\/|\/$/g, '')
              const cleanItemPath = item.path.replace(/^\/|\/$/g, '')
              const isActive = currentPath === cleanItemPath
              const IconComponent = (Icons[item.icon as IconKey] || Icons.HelpCircle) as React.ComponentType<{ className?: string }>
              const hasBadge = 'badge' in item && typeof (item as any).badge === 'string'

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2 py-1.5 rounded-[6px] text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    hoveredItem === item.label && !isActive && "translate-x-0.5",
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>

                  {hasBadge && (
                    <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-[8px] animate-pulse">
                      {(item as any).badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="mt-auto pt-2.5 border-t border-border bg-card">
        <div className="flex items-center gap-2 pl-1">
          <Avatar className="w-7 h-7 ring-2 ring-primary/20 transition-all duration-300 hover:ring-primary/40">
            <AvatarImage src="" alt="Jessin Sam" />
            <AvatarFallback className="text-xs">JS</AvatarFallback>
          </Avatar>
          <div className="text-xs leading-tight">
            <p className="font-semibold text-foreground">Jessin Sam</p>
            <p className="text-muted-foreground text-[9px]">jessin@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
