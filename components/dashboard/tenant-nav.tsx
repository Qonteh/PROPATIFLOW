"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  Search,
  FileText,
  CreditCard,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileSignature,
  Shield,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

/* ------------------------------------------------------------------ */
/*  PropFlow Logo (full - uses your pt_info.png from public/)          */
/* ------------------------------------------------------------------ */
function PFLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <img
        src="/pt_info.png"
        alt="PropFlow"
        className="h-9 w-auto object-contain"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  PropFlow Logo (collapsed mini icon)                                */
/* ------------------------------------------------------------------ */
function PFLogoMini({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img
        src="/pt_info.png"
        alt="PropFlow"
        className="h-8 w-8 object-contain"
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Tenant navigation items                                            */
/* ------------------------------------------------------------------ */
const navItems = [
  { href: "/tenant/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tenant/search", icon: Search, label: "Search Properties" },
  { href: "/tenant/applications", icon: FileText, label: "My Applications" },
  { href: "/tenant/payments", icon: CreditCard, label: "Payments" },
  { href: "/tenant/trust-score", icon: Shield, label: "TrustScore™" },
  // { href: "/tenant/profile", icon: User, label: "My Profile" }, // removed: profile page deleted
  { href: "/tenant/settings", icon: Settings, label: "Settings" },
  { href: "/tenant/leases", icon: FileSignature, label: "Leases" },
]

/* ------------------------------------------------------------------ */
/*  Component props                                                    */
/* ------------------------------------------------------------------ */
interface TenantNavProps {
  user?: {
    full_name?: string
    email?: string
    avatar_url?: string | null
  }
  onLogout?: () => void
}

/* ------------------------------------------------------------------ */
/*  TenantNav                                                          */
/* ------------------------------------------------------------------ */
export function TenantNav({ user, onLogout }: TenantNavProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const displayName = user?.full_name || "Tenant"
  const displayEmail = user?.email || "tenant@email.com"
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "T"

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "group/sidebar relative flex h-screen flex-col bg-card transition-[width] duration-300 ease-in-out",
          collapsed ? "w-[72px]" : "w-[260px]"
        )}
      >
        {/* Subtle right border */}
        <div className="absolute inset-y-0 right-0 w-px bg-border" />

        {/* ── Logo area ────────────────────────────────── */}
        <div
          className={cn(
            "flex h-[64px] shrink-0 items-center transition-all duration-300",
            collapsed ? "justify-center px-0" : "px-5"
          )}
        >
          <div className="flex items-center overflow-hidden">
            {collapsed ? (
              <PFLogoMini className="transition-opacity duration-200" />
            ) : (
              <PFLogo className="transition-opacity duration-200" />
            )}
          </div>
        </div>

        {/* Separator under logo */}
        <div className={cn("mx-3 h-px bg-border", collapsed && "mx-2")} />

        {/* ── Collapse toggle ──────────────────────────── */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "absolute -right-3 top-[72px] z-20 flex h-6 w-6 items-center justify-center",
            "rounded-full border border-border bg-card text-muted-foreground",
            "opacity-0 shadow-sm transition-all duration-200",
            "hover:bg-accent hover:text-foreground",
            "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "group-hover/sidebar:opacity-100"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>

        {/* ── Navigation ───────────────────────────────── */}
        <ScrollArea className="flex-1 py-3">
          <nav
            className={cn(
              "flex flex-col gap-0.5",
              collapsed ? "px-2" : "px-3"
            )}
          >
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href ||
                pathname?.startsWith(item.href + "/")

              const navButton = (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block"
                >
                  <div
                    className={cn(
                      "group/item flex items-center rounded-lg transition-all duration-200",
                      collapsed
                        ? "h-10 w-10 mx-auto justify-center"
                        : "h-10 gap-3 px-3",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "shrink-0 transition-transform duration-200",
                        collapsed ? "h-[18px] w-[18px]" : "h-4 w-4",
                        !isActive && "group-hover/item:scale-110"
                      )}
                    />
                    {!collapsed && (
                      <span className="truncate text-[13px] font-medium">
                        {item.label}
                      </span>
                    )}
                  </div>
                </Link>
              )

              if (collapsed) {
                return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>{navButton}</TooltipTrigger>
                    <TooltipContent
                      side="right"
                      sideOffset={12}
                      className="rounded-md px-3 py-1.5 text-xs font-medium"
                    >
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                )
              }

              return navButton
            })}
          </nav>
        </ScrollArea>

        {/* ── User section ─────────────────────────────── */}
        <div className="shrink-0">
          <div className={cn("mx-3 h-px bg-border", collapsed && "mx-2")} />

          <div className={cn("p-3", collapsed && "flex flex-col items-center gap-1.5 py-3 px-2")}>
            {/* User profile row */}
            <div
              className={cn(
                "flex items-center rounded-lg p-2 transition-colors duration-200",
                collapsed ? "justify-center" : "gap-3"
              )}
            >
              {/* Avatar */}
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={displayName}
                  className={cn(
                    "object-cover rounded-full border-2 border-primary",
                    "h-9 w-9"
                  )}
                />
              ) : (
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground",
                    "h-9 w-9"
                  )}
                >
                  <span className="text-xs font-semibold leading-none">{initials}</span>
                </div>
              )}

              {/* Name + email */}
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-tight text-foreground">
                    {displayName}
                  </p>
                  <p className="truncate text-[11px] leading-tight text-muted-foreground">
                    {displayEmail}
                  </p>
                </div>
              )}
            </div>
            <button
              className={cn(
                "flex h-9 w-full items-center gap-3 rounded-lg px-3 mt-4",
                "text-muted-foreground transition-colors duration-200",
                "hover:bg-destructive/10 hover:text-destructive"
              )}
              onClick={() => onLogout?.()}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="text-[13px] font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  )
}
