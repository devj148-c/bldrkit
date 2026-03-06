import { NextResponse } from "next/server"
import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const invoices = await prisma.invoice.findMany({
    where: { organizationId: session.orgId },
    include: { customer: true, job: true },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(invoices)
}

export async function POST(req: Request) {
  const session = await getSessionWithOrg()
  if (!session?.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { customerId, jobId, lineItems, tax, dueDate, notes } = body

  if (!customerId || !lineItems?.length) {
    return NextResponse.json({ error: "Customer and line items required" }, { status: 400 })
  }

  const subtotal = lineItems.reduce((sum: number, item: { total: number }) => sum + item.total, 0)
  const taxAmount = tax || 0
  const total = subtotal + taxAmount

  const count = await prisma.invoice.count({ where: { organizationId: session.orgId } })
  const invoiceNumber = `INV-${String(count + 1).padStart(4, "0")}`

  const invoice = await prisma.invoice.create({
    data: {
      organizationId: session.orgId,
      customerId,
      jobId: jobId || null,
      invoiceNumber,
      lineItems,
      subtotal,
      tax: taxAmount,
      total,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
    include: { customer: true },
  })

  return NextResponse.json(invoice, { status: 201 })
}
