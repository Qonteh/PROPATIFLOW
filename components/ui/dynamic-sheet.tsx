"use client"
import dynamic from "next/dynamic"

// Dynamically import Sheet and its subcomponents with SSR disabled
export const DynamicSheet = dynamic(() => import("@/components/ui/sheet").then(mod => mod.Sheet), { ssr: false })
export const DynamicSheetTrigger = dynamic(() => import("@/components/ui/sheet").then(mod => mod.SheetTrigger), { ssr: false })
export const DynamicSheetContent = dynamic(() => import("@/components/ui/sheet").then(mod => mod.SheetContent), { ssr: false })
export const DynamicSheetTitle = dynamic(() => import("@/components/ui/sheet").then(mod => mod.SheetTitle), { ssr: false })
