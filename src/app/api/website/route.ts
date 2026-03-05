import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let website = await prisma.website.findUnique({ where: { userId } });

    if (!website) {
      website = await prisma.website.create({
        data: {
          userId,
          template: "modern",
          services: "[]",
          serviceAreas: "[]",
          testimonials: "[]",
          photos: "[]",
        },
      });
    }

    return NextResponse.json(website);
  } catch (error) {
    console.error("Get website error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const website = await prisma.website.upsert({
      where: { userId },
      update: {
        ...(body.template !== undefined && { template: body.template }),
        ...(body.businessName !== undefined && { businessName: body.businessName }),
        ...(body.phone !== undefined && { phone: body.phone }),
        ...(body.email !== undefined && { email: body.email }),
        ...(body.logo !== undefined && { logo: body.logo }),
        ...(body.aboutText !== undefined && { aboutText: body.aboutText }),
        ...(body.services !== undefined && {
          services: typeof body.services === "string" ? body.services : JSON.stringify(body.services),
        }),
        ...(body.serviceAreas !== undefined && {
          serviceAreas: typeof body.serviceAreas === "string" ? body.serviceAreas : JSON.stringify(body.serviceAreas),
        }),
        ...(body.testimonials !== undefined && {
          testimonials: typeof body.testimonials === "string" ? body.testimonials : JSON.stringify(body.testimonials),
        }),
        ...(body.photos !== undefined && {
          photos: typeof body.photos === "string" ? body.photos : JSON.stringify(body.photos),
        }),
        ...(body.published !== undefined && { published: body.published }),
      },
      create: {
        userId,
        template: body.template || "modern",
        businessName: body.businessName || null,
        phone: body.phone || null,
        email: body.email || null,
        aboutText: body.aboutText || null,
        services: typeof body.services === "string" ? body.services : JSON.stringify(body.services || []),
        serviceAreas: typeof body.serviceAreas === "string" ? body.serviceAreas : JSON.stringify(body.serviceAreas || []),
        testimonials: typeof body.testimonials === "string" ? body.testimonials : JSON.stringify(body.testimonials || []),
        photos: typeof body.photos === "string" ? body.photos : JSON.stringify(body.photos || []),
      },
    });

    return NextResponse.json(website);
  } catch (error) {
    console.error("Update website error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
