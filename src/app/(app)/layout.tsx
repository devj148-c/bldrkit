import { redirect } from "next/navigation"
import { getSessionWithOrg } from "@/lib/auth"
import { AppShell } from "@/components/layout/AppShell"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionWithOrg()

  if (!session) {
    redirect("/login")
  }

  return (
    <AppShell
      orgName={session.orgName}
      userName={session.user.name || session.user.email}
    >
      {children}
    </AppShell>
  )
}
