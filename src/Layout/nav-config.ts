import { ClipboardList, CheckCircle2, RefreshCw, Truck, type LucideIcon, LayoutDashboard } from "lucide-react"

export interface NavItem {
  to: string
  label: string
  description: string
  icon: LucideIcon
  badgeKey?: "approval" | "amendment"
}

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    description: "Create forecast entries",
    icon: LayoutDashboard,
  },
  {
    to: "/allocation",
    label: "BIN Allocation",
    description: "Create forecast entries",
    icon: ClipboardList,
  },
  {
    to: "/approval",
    label: "Approval",
    description: "Approve item quantities",
    icon: CheckCircle2,
    badgeKey: "approval",
  },
  {
    to: "/amendment",
    label: "Amendment",
    description: "Amend or cancel items",
    icon: RefreshCw,
    badgeKey: "amendment",
  },
  {
    to: "/fulfillment",
    label: "Fulfillment",
    description: "Track OA allocation",
    icon: Truck,
  },
]

export const PORTAL_META = {
  company: "JANATICS",
  portal: "BIN Portal · Sales",
  user: { name: "Rajan Kumar", role: "Sales Manager" },
  date: "15 Jun 2026",
}
