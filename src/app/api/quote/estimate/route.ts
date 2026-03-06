import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { calculateEstimate, DEFAULT_PRICING, type MaterialType, type RoofComplexity, type WorkType } from "@/lib/quote"

async function resolveOrganizationId(companyId?: string) {
  if (companyId) return companyId
  const org = await prisma.organization.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } })
  return org?.id || null
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      sqft?: number
      complexity?: RoofComplexity
      material?: MaterialType
      workType?: WorkType
      companyId?: string
    }

    const sqft = Number(body.sqft)
    if (!sqft || Number.isNaN(sqft)) {
      return NextResponse.json({ error: "Valid sqft is required" }, { status: 400 })
    }

    const material = (body.material || "architectural") as MaterialType
    const workType = (body.workType || "replacement") as WorkType
    const complexity = (body.complexity || "medium") as RoofComplexity
    const organizationId = await resolveOrganizationId(body.companyId)

    const config = organizationId
      ? await prisma.pricingConfig.findUnique({ where: { organizationId } })
      : null
    const pricing = config || DEFAULT_PRICING

    const estimate = calculateEstimate(sqft, material, workType, complexity, pricing)

    return NextResponse.json({
      lowEstimate: estimate.low,
      highEstimate: estimate.high,
      material,
      sqft,
      complexity,
      workType,
    })
  } catch (error) {
    console.error("Quote estimate failed", error)
    return NextResponse.json({ error: "Failed to calculate estimate" }, { status: 500 })
  }
}
