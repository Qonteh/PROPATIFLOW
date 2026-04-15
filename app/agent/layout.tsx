import type React from "react"
import { AgentNav } from "@/components/dashboard/agent-nav"

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AgentNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
