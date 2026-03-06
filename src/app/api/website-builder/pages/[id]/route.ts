import { NextResponse } from "next/server"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // In production, this would fetch from the database
  // For now, return a 404 since data lives in localStorage
  return NextResponse.json({ error: "Page not found", id }, { status: 404 })
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await req.json()
    // In production, this would update the database
    // For now, just acknowledge the update
    return NextResponse.json({
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 })
  }
}
