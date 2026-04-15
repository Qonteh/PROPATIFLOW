"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { LanguageSwitcher } from "@/components/language-switcher"

export function MobileMenu() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <nav className="flex flex-col gap-4 mt-8">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Language</span>
            <LanguageSwitcher />
          </div>
          <Link
            href="#features"
            className="text-lg font-medium hover:text-primary transition-colors py-2"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-lg font-medium hover:text-primary transition-colors py-2"
            onClick={() => setOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="#pricing"
            className="text-lg font-medium hover:text-primary transition-colors py-2"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <div className="border-t border-border my-4" />
          <Link href="/login" onClick={() => setOpen(false)}>
            <Button variant="outline" className="w-full justify-start text-lg bg-transparent">
              Sign In
            </Button>
          </Link>
          <Link href="/register" onClick={() => setOpen(false)}>
            <Button className="w-full justify-start text-lg">Get Started</Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
