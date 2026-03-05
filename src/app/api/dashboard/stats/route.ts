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

    const totalLeads = await prisma.lead.count({ where: { userId } });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const leadsThisMonth = await prisma.lead.count({
      where: { userId, createdAt: { gte: startOfMonth } },
    });

    const wonLeads = await prisma.lead.count({
      where: { userId, status: "won" },
    });
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    const pipeline = await prisma.lead.findMany({
      where: { userId, status: { notIn: ["won", "lost"] } },
      select: { estimatedValue: true },
    });
    const pipelineValue = pipeline.reduce((sum, l) => sum + (l.estimatedValue || 0), 0);

    const recentLeads = await prisma.lead.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        status: true,
        jobType: true,
        estimatedValue: true,
        createdAt: true,
        source: true,
      },
    });

    return NextResponse.json({
      totalLeads,
      leadsThisMonth,
      conversionRate,
      pipelineValue,
      recentLeads,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
