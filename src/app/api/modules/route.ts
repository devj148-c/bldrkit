import { NextResponse } from "next/server"
import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getSessionWithOrg()
  if (!session?.orgId || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { moduleKey, action } = await req.json()

  if (action === "enable") {
    await prisma.organizationModule.upsert({
      where: {
        organizationId_moduleKey: {
          organizationId: session.orgId,
          moduleKey,
        },
      },
      create: {
        organizationId: session.orgId,
        moduleKey,
      },
      update: {},
    })
  } else if (action === "disable") {
    await prisma.organizationModule.deleteMany({
      where: {
        organizationId: session.orgId,
        moduleKey,
      },
    })
  }

  return NextResponse.json({ success: true })
}
