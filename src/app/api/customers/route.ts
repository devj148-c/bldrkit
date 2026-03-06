import { NextResponse } from "next/server"
import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const customers = await prisma.customer.findMany({
    where: { organizationId: session.orgId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(customers)
}

export async function POST(req: Request) {
  const session = await getSessionWithOrg()
  if (!session?.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { firstName, lastName, email, phone, address, city, state, zip, source, notes } = body

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "First and last name required" }, { status: 400 })
  }

  const customer = await prisma.customer.create({
    data: {
      organizationId: session.orgId,
      firstName,
      lastName,
      email: email || null,
      phone: phone || null,
      address: address || null,
      city: city || null,
      state: state || null,
      zip: zip || null,
      source: source || null,
      notes: notes || null,
    },
  })

  return NextResponse.json(customer, { status: 201 })
}
