import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, getUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { estimateRoofArea } from "@/lib/openai";

const PRICE_RANGES: Record<string, { min: number; max: number }> = {
  asphalt: { min: 3.5, max: 5.5 },
  metal: { min: 7, max: 12 },
  tile: { min: 10, max: 18 },
  slate: { min: 15, max: 25 },
  flat_tpo: { min: 5, max: 8 },
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quotes = await prisma.quote.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { lead: { select: { name: true, status: true } } },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error("List quotes error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = getUserId(session);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 });
    }

    const estimate = await estimateRoofArea(body.address);
    const sqFt = estimate.estimatedSqFt;
    const materialType = body.materialType || "asphalt";
    const range = PRICE_RANGES[materialType] || PRICE_RANGES.asphalt;
    const priceMin = Math.round(sqFt * range.min);
    const priceMax = Math.round(sqFt * range.max);

    let leadId: string | null = null;

    if (body.leadName && body.leadEmail) {
      const lead = await prisma.lead.create({
        data: {
          name: body.leadName,
          email: body.leadEmail,
          phone: body.leadPhone || null,
          address: body.address,
          status: "new",
          jobType: "replacement",
          source: "quote_tool",
          estimatedValue: Math.round((priceMin + priceMax) / 2),
          roofArea: sqFt,
          materialPref: materialType,
          userId,
        },
      });
      leadId = lead.id;
    }

    const quote = await prisma.quote.create({
      data: {
        address: body.address,
        roofAreaSqFt: sqFt,
        materialType,
        priceMin,
        priceMax,
        leadName: body.leadName || null,
        leadEmail: body.leadEmail || null,
        leadPhone: body.leadPhone || null,
        leadId,
        userId,
      },
    });

    return NextResponse.json({
      ...quote,
      estimate,
    }, { status: 201 });
  } catch (error) {
    console.error("Create quote error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
