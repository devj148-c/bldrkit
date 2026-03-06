import { NextResponse } from "next/server"
import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DEFAULT_PRICING } from "@/lib/quote"

export async function GET() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const config = await prisma.pricingConfig.findUnique({ where: { organizationId: session.orgId } })
  return NextResponse.json(config || { organizationId: session.orgId, ...DEFAULT_PRICING })
}

export async function POST(req: Request) {
  const session = await getSessionWithOrg()
  if (!session?.orgId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = (await req.json()) as Record<string, number>
  const config = await prisma.pricingConfig.upsert({
    where: { organizationId: session.orgId },
    create: {
      organizationId: session.orgId,
      threeTabPerSqft: Number(body.threeTabPerSqft ?? DEFAULT_PRICING.threeTabPerSqft),
      architecturalPerSqft: Number(body.architecturalPerSqft ?? DEFAULT_PRICING.architecturalPerSqft),
      metalPerSqft: Number(body.metalPerSqft ?? DEFAULT_PRICING.metalPerSqft),
      tilePerSqft: Number(body.tilePerSqft ?? DEFAULT_PRICING.tilePerSqft),
      minimumJobPrice: Number(body.minimumJobPrice ?? DEFAULT_PRICING.minimumJobPrice),
      repairMarkup: Number(body.repairMarkup ?? DEFAULT_PRICING.repairMarkup),
      complexitySimple: Number(body.complexitySimple ?? DEFAULT_PRICING.complexitySimple),
      complexityMedium: Number(body.complexityMedium ?? DEFAULT_PRICING.complexityMedium),
      complexityComplex: Number(body.complexityComplex ?? DEFAULT_PRICING.complexityComplex),
    },
    update: {
      threeTabPerSqft: Number(body.threeTabPerSqft ?? DEFAULT_PRICING.threeTabPerSqft),
      architecturalPerSqft: Number(body.architecturalPerSqft ?? DEFAULT_PRICING.architecturalPerSqft),
      metalPerSqft: Number(body.metalPerSqft ?? DEFAULT_PRICING.metalPerSqft),
      tilePerSqft: Number(body.tilePerSqft ?? DEFAULT_PRICING.tilePerSqft),
      minimumJobPrice: Number(body.minimumJobPrice ?? DEFAULT_PRICING.minimumJobPrice),
      repairMarkup: Number(body.repairMarkup ?? DEFAULT_PRICING.repairMarkup),
      complexitySimple: Number(body.complexitySimple ?? DEFAULT_PRICING.complexitySimple),
      complexityMedium: Number(body.complexityMedium ?? DEFAULT_PRICING.complexityMedium),
      complexityComplex: Number(body.complexityComplex ?? DEFAULT_PRICING.complexityComplex),
    },
  })

  return NextResponse.json(config)
}
