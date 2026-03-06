"use client"

import { useState } from "react"
import type { RoofData } from "@/lib/quote"

interface MeasureResponse extends RoofData {
  manualEntryRequired: boolean
  reason?: string
  formattedAddress?: string
}

export function useRoofMeasurement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function measure(address: string): Promise<MeasureResponse> {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/quote/measure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      })

      const data = (await response.json()) as MeasureResponse & { error?: string }
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to measure roof")
      }

      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to measure roof"
      setError(message)
      return {
        manualEntryRequired: true,
        reason: message,
        totalSqft: 0,
        avgPitchDegrees: 20,
        pitchRatio: "4/12",
        segments: 0,
        complexity: "medium",
        imageryDate: "unknown",
      }
    } finally {
      setLoading(false)
    }
  }

  return { measure, loading, error }
}
