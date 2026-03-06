import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { ModuleManager } from "@/components/settings/ModuleManager"

export default async function ModulesPage() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const enabledModules = await prisma.organizationModule.findMany({
    where: { organizationId: session.orgId },
  })

  return (
    <>
      <Header title="Modules" subtitle="Enable or disable trade modules" />
      <div className="p-6">
        <ModuleManager
          enabledKeys={enabledModules.map((m) => m.moduleKey)}
          isAdmin={session.role === "ADMIN"}
        />
      </div>
    </>
  )
}
