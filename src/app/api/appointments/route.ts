import { NextResponse } from "next/server"

// In-memory store for development (no DB connected)
const appointments: Record<string, unknown>[] = []

export async function GET() {
  return NextResponse.json(appointments)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      serviceRequested,
      scheduledDate,
      scheduledTime,
      notes,
      source,
      pageUrl,
    } = body

    if (!customerName || !customerPhone || !serviceRequested || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: "Name, phone, service, date, and time are required" },
        { status: 400 }
      )
    }

    const appointment = {
      id: crypto.randomUUID(),
      customerName,
      customerPhone,
      customerEmail: customerEmail || null,
      customerAddress: customerAddress || null,
      serviceRequested,
      scheduledDate,
      scheduledTime,
      duration: 60,
      notes: notes || null,
      photos: [],
      status: "PENDING",
      confirmedAt: null,
      cancelledAt: null,
      completedAt: null,
      customerConfirmationSent: false,
      rooferNotificationSent: false,
      reminderSent: false,
      calendarInviteSent: false,
      jobId: null,
      customerId: null,
      source: source || "widget",
      pageUrl: pageUrl || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    appointments.push(appointment)

    return NextResponse.json(appointment, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
  }
}
