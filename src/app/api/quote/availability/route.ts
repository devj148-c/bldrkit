import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get("date")
  const companyId = searchParams.get("companyId")

  if (!date) {
    return NextResponse.json({ error: "date is required" }, { status: 400 })
  }

  return NextResponse.json({
    companyId,
    date,
    slots: [
      { time: "Morning", available: true },
      { time: "Afternoon", available: true },
      { time: "Evening", available: true },
    ],
  })
}
