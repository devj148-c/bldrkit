import { NextResponse } from "next/server"
import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const jobs = await prisma.job.findMany({
    where: { organizationId: session.orgId },
    include: { customer: true },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(jobs)
}

export async function POST(req: Request) {
  const session = await getSessionWithOrg()
  if (!session?.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { title, description, customerId, moduleKey, priority, jobAddress, jobCity, jobState, jobZip, scheduledStart, scheduledEnd } = body

  if (!title || !customerId) {
    return NextResponse.json({ error: "Title and customer required" }, { status: 400 })
  }

  const job = await prisma.job.create({
    data: {
      organizationId: session.orgId,
      customerId,
      title,
      description: description || null,
      moduleKey: moduleKey || null,
      priority: priority || "MEDIUM",
      jobAddress: jobAddress || null,
      jobCity: jobCity || null,
      jobState: jobState || null,
      jobZip: jobZip || null,
      scheduledStart: scheduledStart ? new Date(scheduledStart) : null,
      scheduledEnd: scheduledEnd ? new Date(scheduledEnd) : null,
    },
    include: { customer: true },
  })

  return NextResponse.json(job, { status: 201 })
}

export async function PATCH(req: Request) {
  const session = await getSessionWithOrg()
  if (!session?.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { id, status, ...rest } = body

  if (!id) return NextResponse.json({ error: "Job ID required" }, { status: 400 })

  const job = await prisma.job.update({
    where: { id, organizationId: session.orgId },
    data: {
      ...(status && { status }),
      ...rest,
      ...(status === "COMPLETED" && { completedAt: new Date() }),
    },
    include: { customer: true },
  })

  return NextResponse.json(job)
}
