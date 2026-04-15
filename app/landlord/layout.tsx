"use client"

import type React from "react"
import { LandlordNav } from "@/components/dashboard/landlord-nav"
import { useAuth } from "@/lib/auth/auth-context"
import { LanguageProvider } from "@/contexts/language-context"
import { DynamicSheet, DynamicSheetTrigger, DynamicSheetContent, DynamicSheetTitle } from "@/components/ui/dynamic-sheet"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <LanguageProvider>
      <div className="flex h-screen overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:block h-full">
          <LandlordNav user={user || undefined} onLogout={logout} />
        </div>
        {/* Mobile hamburger and sidebar */}
        <div className="md:hidden fixed top-0 left-0 z-40">
          <DynamicSheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <DynamicSheetTrigger asChild>
              <button
                className="m-2 p-1.5 rounded-md bg-card border border-border text-muted-foreground"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </DynamicSheetTrigger>
            <DynamicSheetContent side="left" className="p-0 w-64 max-w-full">
              <DynamicSheetTitle>
                <span className="sr-only">Navigation</span>
              </DynamicSheetTitle>
              <LandlordNav user={user || undefined} onLogout={() => { setSidebarOpen(false); logout(); }} />
            </DynamicSheetContent>
          </DynamicSheet>
        </div>
        {/* Main content only */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </LanguageProvider>
  );
}
