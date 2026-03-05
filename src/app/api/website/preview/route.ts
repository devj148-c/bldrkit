import { NextResponse } from "next/server";
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

    const website = await prisma.website.findUnique({ where: { userId } });
    if (!website) {
      return NextResponse.json({ error: "No website configured" }, { status: 404 });
    }

    return NextResponse.json(website);
  } catch (error) {
    console.error("Website preview error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
