import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

interface SubmitPhoto {
  filename: string
  dataUrl: string
}

async function resolveOrganizationId(companyId?: string) {
  if (companyId) return companyId
  const org = await prisma.organization.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } })
  return org?.id || null
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string
      phone?: string
      email?: string
      address?: string
      roofData?: {
        totalSqft?: number
        avgPitchDegrees?: number
        pitchRatio?: string
        segments?: number
        complexity?: string
        imageryDate?: string
        lat?: number
        lng?: number
      }
      material?: string
      workType?: string
      lowEstimate?: number
      highEstimate?: number
      photos?: SubmitPhoto[]
      appointmentDate?: string
      appointmentSlot?: string
      companyId?: string
    }

    const name = body.name?.trim()
    const phone = body.phone?.trim()
    const email = body.email?.trim()
    const address = body.address?.trim()
    const workType = body.workType?.trim()
    const organizationId = await resolveOrganizationId(body.companyId)

    if (!organizationId) {
      return NextResponse.json({ error: "No organization configured" }, { status: 400 })
    }
    if (!name || !phone || !email || !address || !workType) {
      return NextResponse.json({ error: "Missing required lead fields" }, { status: 400 })
    }

    const lead = await prisma.lead.create({
      data: {
        organizationId,
        name,
        phone,
        email,
        address,
        lat: body.roofData?.lat,
        lng: body.roofData?.lng,
        roofSqft: body.roofData?.totalSqft,
        roofPitch: body.roofData?.avgPitchDegrees,
        roofPitchRatio: body.roofData?.pitchRatio,
        roofSegments: body.roofData?.segments,
        roofComplexity: body.roofData?.complexity,
        imageryDate: body.roofData?.imageryDate,
        workType,
        material: body.material || null,
        lowEstimate: body.lowEstimate,
        highEstimate: body.highEstimate,
        appointmentDate: body.appointmentDate ? new Date(body.appointmentDate) : null,
        appointmentSlot: body.appointmentSlot || null,
        photos: {
          create:
            body.photos?.slice(0, 5).map((photo, index) => ({
              filename: photo.filename || `upload-${index + 1}.jpg`,
              url: photo.dataUrl,
            })) || [],
        },
      },
      include: { photos: true, organization: true },
    })

    // MVP notifications
    console.log("New quote lead submission", {
      leadId: lead.id,
      organization: lead.organization.name,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      address: lead.address,
      roofSqft: lead.roofSqft,
      roofPitch: lead.roofPitchRatio || lead.roofPitch,
      complexity: lead.roofComplexity,
      workType: lead.workType,
      material: lead.material,
      estimate: [lead.lowEstimate, lead.highEstimate],
      appointmentDate: lead.appointmentDate,
      appointmentSlot: lead.appointmentSlot,
      photos: lead.photos.map((photo) => ({ id: photo.id, filename: photo.filename })),
    })

    return NextResponse.json({
      leadId: lead.id,
      confirmationMessage: "You're all set. We received your request and will contact you soon.",
    })
  } catch (error) {
    console.error("Quote submit failed", error)
    return NextResponse.json({ error: "Failed to submit quote" }, { status: 500 })
  }
}
