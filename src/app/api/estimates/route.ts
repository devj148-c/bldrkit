import { NextResponse } from "next/server"
import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const estimates = await prisma.estimate.findMany({
    where: { organizationId: session.orgId },
    include: { customer: true, job: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(estimates)
}

export async function POST(req: Request) {
  const session = await getSessionWithOrg()
  if (!session?.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { customerId, jobId, lineItems, tax, notes, validUntil } = body

  if (!customerId || !lineItems?.length) {
    return NextResponse.json({ error: "Customer and line items required" }, { status: 400 })
  }

  // Calculate totals
  const subtotal = lineItems.reduce((sum: number, item: { total: number }) => sum + item.total, 0)
  const taxAmount = tax || 0
  const total = subtotal + taxAmount

  // Generate estimate number
  const count = await prisma.estimate.count({ where: { organizationId: session.orgId } })
  const estimateNumber = `EST-${String(count + 1).padStart(4, "0")}`

  const estimate = await prisma.estimate.create({
    data: {
      organizationId: session.orgId,
      customerId,
      jobId: jobId || null,
      estimateNumber,
      lineItems,
      subtotal,
      tax: taxAmount,
      total,
      notes: notes || null,
      validUntil: validUntil ? new Date(validUntil) : null,
    },
    include: { customer: true },
  })

  return NextResponse.json(estimate, { status: 201 })
}
