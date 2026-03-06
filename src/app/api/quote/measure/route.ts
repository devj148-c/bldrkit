import { NextResponse } from "next/server"
import { parseSolarRoofData } from "@/lib/quote"

interface GeocodeResult {
  lat: number
  lng: number
  formattedAddress: string
}

async function geocodeAddress(address: string, apiKey: string): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({ address, key: apiKey })
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`)
  if (!response.ok) return null

  const data = (await response.json()) as {
    results?: Array<{
      formatted_address?: string
      geometry?: { location?: { lat?: number; lng?: number } }
    }>
  }

  const first = data.results?.[0]
  const lat = first?.geometry?.location?.lat
  const lng = first?.geometry?.location?.lng

  if (typeof lat !== "number" || typeof lng !== "number") return null
  return {
    lat,
    lng,
    formattedAddress: first?.formatted_address || address,
  }
}

async function fetchSolarInsights(lat: number, lng: number, apiKey: string) {
  const params = new URLSearchParams({
    "location.latitude": String(lat),
    "location.longitude": String(lng),
    requiredQuality: "HIGH",
    key: apiKey,
  })
  const response = await fetch(`https://solar.googleapis.com/v1/buildingInsights:findClosest?${params.toString()}`)
  if (!response.ok) return null
  return response.json()
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { address?: string }
    const address = body.address?.trim()
    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        manualEntryRequired: true,
        reason: "Google Maps API key is not configured",
      })
    }

    const geocoded = await geocodeAddress(address, apiKey)
    if (!geocoded) {
      return NextResponse.json({
        manualEntryRequired: true,
        reason: "Could not geocode address",
      })
    }

    const solarRaw = await fetchSolarInsights(geocoded.lat, geocoded.lng, apiKey)
    const roofData = parseSolarRoofData(solarRaw, geocoded.lat, geocoded.lng)
    if (!roofData) {
      return NextResponse.json({
        manualEntryRequired: true,
        reason: "No Solar API roof data available",
        lat: geocoded.lat,
        lng: geocoded.lng,
        formattedAddress: geocoded.formattedAddress,
      })
    }

    return NextResponse.json({
      manualEntryRequired: false,
      formattedAddress: geocoded.formattedAddress,
      ...roofData,
    })
  } catch (error) {
    console.error("Quote measurement failed", error)
    return NextResponse.json(
      {
        manualEntryRequired: true,
        reason: "Measurement service unavailable",
      },
      { status: 200 }
    )
  }
}
