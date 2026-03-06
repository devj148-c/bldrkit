import { NextResponse } from "next/server"
import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getSessionWithOrg()
  if (!session?.orgId || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { email, role } = await req.json()

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 })
  }

  // Find or create user
  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({
      data: { email, name: email.split("@")[0] },
    })
  }

  // Check existing membership
  const existing = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: session.orgId,
      },
    },
  })

  if (existing) {
    return NextResponse.json({ error: "User already a member" }, { status: 409 })
  }

  // Create membership (pending)
  const member = await prisma.organizationMember.create({
    data: {
      userId: user.id,
      organizationId: session.orgId,
      role: role || "MEMBER",
    },
  })

  // TODO: Send invite email via Resend

  return NextResponse.json({ success: true, memberId: member.id })
}
