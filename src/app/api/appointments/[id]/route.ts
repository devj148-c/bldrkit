import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await req.json()
    const { status } = body

    const validStatuses = ["PENDING", "CONFIRMED", "CANCELLED", "RESCHEDULED", "COMPLETED", "NO_SHOW"]
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // In production, update the database record
    const now = new Date().toISOString()
    const updates: Record<string, unknown> = {
      ...body,
      updatedAt: now,
    }

    if (status === "CONFIRMED") updates.confirmedAt = now
    if (status === "CANCELLED") updates.cancelledAt = now
    if (status === "COMPLETED") updates.completedAt = now

    return NextResponse.json({
      id,
      ...updates,
    })
  } catch {
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 })
  }
}
