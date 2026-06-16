import { Brand } from "./Brand"
import { SidebarNav } from "./SidebarNav"
import { UserProfile } from "./UserProfile"

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Brand />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <SidebarNav />
      </div>
      <div className="border-t border-sidebar-border pt-2">
        <UserProfile />
      </div>
    </aside>
  )
}
