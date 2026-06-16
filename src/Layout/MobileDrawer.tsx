import { X } from "lucide-react"
import { Brand } from "./Brand"
import { SidebarNav } from "./SidebarNav"
import { UserProfile } from "./UserProfile"

interface Props {
  open: boolean
  onClose: () => void
}

export function MobileDrawer({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-foreground/40 backdrop-blur-sm"
      />
      <div className="absolute inset-y-0 left-0 flex w-[17rem] animate-slide-in-left flex-col border-r border-sidebar-border bg-sidebar shadow-2xl">
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <Brand />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <SidebarNav onNavigate={onClose} />
        </div>
        <div className="border-t border-sidebar-border pt-2">
          <UserProfile />
        </div>
      </div>
    </div>
  )
}
