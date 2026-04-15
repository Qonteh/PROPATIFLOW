"use client"
import type React from "react"
import { TenantNav } from "@/components/dashboard/tenant-nav"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, useCallback } from "react"
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LanguageProvider } from "@/contexts/language-context"
import LanguageSwitcher from "@/components/LanguageSwitcherClient"

function NotificationBell({ iconClassName = "" }: { iconClassName?: string } = {}) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const notificationDropdownRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((n) => !n.is_read).length

  useEffect(() => {
    fetchNotifications()
    const handleClick = (e: MouseEvent) => {
      if (
        showNotifications &&
        notificationDropdownRef.current &&
        !notificationDropdownRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
    // eslint-disable-next-line
  }, [showNotifications])

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      const result = await res.json()
      setNotifications(result.notifications || [])
    } catch {
      setNotifications([])
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full hover:bg-muted"
        onClick={() => setShowNotifications((v) => !v)}
        aria-label="Show notifications"
      >
        <Bell className={`h-6 w-6 ${iconClassName}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount}
          </span>
        )}
      </Button>
      {showNotifications && (
        <div
          ref={notificationDropdownRef}
          className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <span className="font-semibold text-foreground">Notifications</span>
            </div>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="ml-2 px-2 py-1 text-xs"
                onClick={async () => {
                  await fetch("/api/notifications/mark-all-read", { method: "POST" });
                  fetchNotifications();
                }}
              >
                Mark all as read
              </Button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications yet</div>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.map((n, i) => (
                  <li key={n.id || i} className={`px-4 py-3 transition-colors ${!n.is_read ? 'bg-primary/5' : ''}`}>
                    <div className="font-medium text-sm text-foreground">{n.title || n.type || 'Notification'}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 break-words">{n.content || n.message || n.body}</div>
                    <div className="text-[11px] text-muted-foreground/60 mt-1">
                      {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }, [router]);

  // Get user's real name for welcome message
  const userName = user?.full_name || user?.email || "User";

  return (
    <LanguageProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:block h-full">
          <TenantNav user={user ?? undefined} onLogout={handleLogout} />
        </div>
        {/* Mobile hamburger and sidebar */}
        <div className="md:hidden fixed top-0 left-0 z-40">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <button
                className="m-2 p-1.5 rounded-md bg-card border border-border text-muted-foreground"
                aria-label="Open menu"
                suppressHydrationWarning={true}
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 max-w-full">
              <SheetTitle>
                <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
                  Navigation
                </span>
              </SheetTitle>
              <TenantNav user={user ?? undefined} onLogout={() => { setSidebarOpen(false); handleLogout(); }} />
            </SheetContent>
          </Sheet>
        </div>
        {/* Main content only */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="w-full px-4 py-2 md:py-1 bg-background border-b border-border flex items-center justify-between gap-2">
            {/* Centered Language Icon */}
            <div className="flex-1 flex justify-center">
              <LanguageSwitcher iconClassName="text-black" />
            </div>
            {/* Profile name and image on right, image after name */}
            {!loading && user && (
              <div className="flex items-center gap-2">
                <span className="text-black font-semibold text-base truncate max-w-[120px]">{user.full_name || user.email}</span>
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.full_name || user.email}
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                    {(user.full_name || user.email || 'U')[0]}
                  </div>
                )}
              </div>
            )}
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </LanguageProvider>
  )
}
