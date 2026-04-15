"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-context"
import { Button } from "@/components/ui/button"
import { Building2, LayoutDashboard, Briefcase, Users, Home, DollarSign, Settings, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"

export function AgentNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    { href: "/agent/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/agent/deals", icon: Briefcase, label: "Active Deals" },
    { href: "/agent/clients", icon: Users, label: "Clients" },
    { href: "/agent/properties", icon: Home, label: "Properties" },
    { href: "/agent/commissions", icon: DollarSign, label: "Commissions" },
    { href: "/agent/settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Building2 className="h-8 w-8 text-primary" />
        <div className="flex flex-col">
          <span className="font-heading text-lg font-bold">RentSecure</span>
          <span className="text-xs text-muted-foreground">Agent Portal</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Button>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">{user?.full_name?.[0] || "A"}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.full_name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full gap-2 bg-transparent" onClick={() => logout()}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
