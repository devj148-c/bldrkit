import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { TeamManager } from "@/components/team/TeamManager"

export default async function TeamPage() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const members = await prisma.organizationMember.findMany({
    where: { organizationId: session.orgId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
      moduleRoles: true,
    },
    orderBy: { invitedAt: "asc" },
  })

  const enabledModules = await prisma.organizationModule.findMany({
    where: { organizationId: session.orgId },
  })

  return (
    <>
      <Header title="Team" subtitle={`${members.length} team members`} />
      <div className="p-6">
        <TeamManager
          members={JSON.parse(JSON.stringify(members))}
          enabledModules={enabledModules.map((m) => m.moduleKey)}
          currentRole={session.role || "MEMBER"}
        />
      </div>
    </>
  )
}
