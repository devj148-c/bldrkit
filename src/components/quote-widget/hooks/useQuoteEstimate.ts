"use client"

import { useState } from "react"
import type { MaterialType, RoofComplexity, WorkType } from "@/lib/quote"

interface EstimateResponse {
  lowEstimate: number
  highEstimate: number
  material: string
  sqft: number
}

export function useQuoteEstimate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function estimate(input: {
    sqft: number
    complexity: RoofComplexity
    material: MaterialType
    workType: WorkType
    companyId?: string
  }): Promise<EstimateResponse> {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/quote/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      })
      const data = (await response.json()) as EstimateResponse & { error?: string }
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to calculate estimate")
      }
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to calculate estimate"
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { estimate, loading, error }
}
