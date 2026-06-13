import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as Icons from 'lucide-react'
import { cn } from '../lib/utils'
import type { UserRole } from '@/config/portalConfig.types'
import { usePortalConfig } from '@/context/PortalConfigContext'

const MobileBottomNav: React.FC = () => {
  const { currentUserRole } = useAuth()
  const location = useLocation()

  const currentRole: UserRole = (currentUserRole as UserRole) || 'sales_rep'

  const { config } = usePortalConfig()

  const filteredNavigation = config.navigation.primary.filter((item) =>
    (item.roles as readonly string[]).includes(currentRole),
  )

  const itemsCount = filteredNavigation.length

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-card/90 backdrop-blur-md border-t border-border pb-safe">
      <div
        className={cn(
          "grid h-16 items-center justify-items-center w-full px-2",
          itemsCount === 5 ? "grid-cols-5" : "grid-cols-4"
        )}
      >
        {filteredNavigation.map((item) => {
          const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle

          const isActive = item.path === '/dashboard'
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path)

          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 w-full h-full text-center transition-all duration-200 active:scale-95',
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <IconComponent
                className={cn(
                  "w-5 h-5 transition-transform",
                  isActive && "scale-110 stroke-[2.5]"
                )}
              />
              <span className="text-[10px] tracking-tight font-medium max-w-full truncate px-0.5">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomNav
