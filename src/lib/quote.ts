export type RoofComplexity = "simple" | "medium" | "complex"
export type WorkType = "replacement" | "repair" | "storm" | "inspection" | "unsure"
export type MaterialType = "3tab" | "architectural" | "metal" | "tile" | "unsure"

export interface RoofData {
  totalSqft: number
  avgPitchDegrees: number
  pitchRatio: string
  segments: number
  complexity: RoofComplexity
  imageryDate: string
  lat?: number
  lng?: number
}

export interface PricingValues {
  threeTabPerSqft: number
  architecturalPerSqft: number
  metalPerSqft: number
  tilePerSqft: number
  minimumJobPrice: number
  repairMarkup: number
  complexitySimple: number
  complexityMedium: number
  complexityComplex: number
}

export const DEFAULT_PRICING: PricingValues = {
  threeTabPerSqft: 3.5,
  architecturalPerSqft: 4.5,
  metalPerSqft: 7,
  tilePerSqft: 10,
  minimumJobPrice: 5000,
  repairMarkup: 0.2,
  complexitySimple: 1,
  complexityMedium: 1.15,
  complexityComplex: 1.3,
}

export function toPitchRatio(pitchDegrees: number): string {
  const pitchOver12 = Math.max(1, Math.round(Math.tan((pitchDegrees * Math.PI) / 180) * 12))
  return `${pitchOver12}/12`
}

export function deriveComplexity(segments: number): RoofComplexity {
  if (segments <= 2) return "simple"
  if (segments <= 6) return "medium"
  return "complex"
}

export function parseSolarRoofData(raw: unknown, lat?: number, lng?: number): RoofData | null {
  if (!raw || typeof raw !== "object") return null
  const data = raw as Record<string, unknown>
  const solarPotential = data.solarPotential as Record<string, unknown> | undefined
  const wholeRoofStats = solarPotential?.wholeRoofStats as Record<string, unknown> | undefined
  const areaMeters2 = typeof wholeRoofStats?.areaMeters2 === "number" ? wholeRoofStats.areaMeters2 : null
  if (!areaMeters2 || Number.isNaN(areaMeters2)) return null

  const roofSegments = Array.isArray(solarPotential?.roofSegmentSummaries)
    ? (solarPotential?.roofSegmentSummaries as Array<Record<string, unknown>>)
    : []

  const averagePitch =
    roofSegments.length > 0
      ? roofSegments.reduce((sum, segment) => {
          const pitch = typeof segment.pitchDegrees === "number" ? segment.pitchDegrees : 0
          return sum + pitch
        }, 0) / roofSegments.length
      : 20

  const imageryDate = data.imageryDate as Record<string, unknown> | undefined
  const year = typeof imageryDate?.year === "number" ? imageryDate.year : null
  const month = typeof imageryDate?.month === "number" ? imageryDate.month : null
  const day = typeof imageryDate?.day === "number" ? imageryDate.day : null
  const imageryDateString =
    year && month && day ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "unknown"

  return {
    totalSqft: Math.round(areaMeters2 * 10.764),
    avgPitchDegrees: Math.round(averagePitch * 10) / 10,
    pitchRatio: toPitchRatio(averagePitch),
    segments: roofSegments.length,
    complexity: deriveComplexity(roofSegments.length),
    imageryDate: imageryDateString,
    lat,
    lng,
  }
}

export function calculateEstimate(
  sqft: number,
  material: MaterialType,
  workType: WorkType,
  complexity: RoofComplexity,
  pricing: PricingValues
): { low: number; high: number } {
  const basePrices: Record<MaterialType, number> = {
    "3tab": pricing.threeTabPerSqft,
    architectural: pricing.architecturalPerSqft,
    metal: pricing.metalPerSqft,
    tile: pricing.tilePerSqft,
    unsure: pricing.architecturalPerSqft,
  }

  const complexityMultipliers: Record<RoofComplexity, number> = {
    simple: pricing.complexitySimple,
    medium: pricing.complexityMedium,
    complex: pricing.complexityComplex,
  }

  if (workType === "inspection") {
    return { low: 0, high: 0 }
  }

  let workMultiplier = 1
  if (workType === "repair") {
    workMultiplier = 0.3
  } else if (workType === "storm") {
    workMultiplier = 0.8
  }

  const baseEstimate = sqft * (basePrices[material] || basePrices.architectural) * (complexityMultipliers[complexity] || 1.15) * workMultiplier
  const low = Math.max(Math.round((baseEstimate * 0.85) / 100) * 100, pricing.minimumJobPrice)
  const high = Math.round((baseEstimate * 1.15) / 100) * 100

  return { low, high }
}
