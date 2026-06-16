import { Bell, Boxes, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchBar } from "./SearchBar"
import { ThemeToggle } from "./ThemeToggle"
import { PORTAL_META } from "./nav-config"

interface Props {
  onOpenMenu: () => void
}

export function TopBar({ onOpenMenu }: Props) {
  const { user } = PORTAL_META
  const initials = user.name.split(" ").map((p) => p[0]).join("")

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <Button
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onOpenMenu}
        aria-label="Open navigation"
      >
        <Menu />
      </Button>

      <span className="flex items-center gap-2 lg:hidden">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Boxes className="size-4" />
        </span>
        <span className="text-sm font-bold tracking-tight">{PORTAL_META.company}</span>
      </span>

      <div className="flex-1 lg:hidden" />

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-sm" aria-label="Notifications" className="relative">
          <Bell />
          <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-primary" />
        </Button>
        <span className="hidden size-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground sm:flex">
          {initials}
        </span>
      </div>
    </header>
  )
}
