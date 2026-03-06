"use client"

import { Sidebar } from "./Sidebar"

interface AppShellProps {
  children: React.ReactNode
  orgName?: string
  userName?: string
}

export function AppShell({ children, orgName, userName }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar orgName={orgName} userName={userName} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
