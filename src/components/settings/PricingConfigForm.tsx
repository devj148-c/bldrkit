"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PricingFormProps {
  initialValues: {
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
}

export function PricingConfigForm({ initialValues }: PricingFormProps) {
  const [values, setValues] = useState(initialValues)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function updateValue(key: keyof typeof values, value: string) {
    setValues((current) => ({ ...current, [key]: Number(value) }))
  }

  async function saveConfig() {
    setSaving(true)
    setMessage(null)

    try {
      const response = await fetch("/api/quote/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to save pricing")
      }

      setMessage("Pricing updated")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to save pricing")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Quote Pricing</CardTitle>
        <CardDescription>Configure material pricing and multipliers used for instant quote estimates.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="threeTabPerSqft">3-Tab ($/sqft)</Label>
            <Input id="threeTabPerSqft" type="number" step="0.01" value={values.threeTabPerSqft} onChange={(e) => updateValue("threeTabPerSqft", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="architecturalPerSqft">Architectural ($/sqft)</Label>
            <Input id="architecturalPerSqft" type="number" step="0.01" value={values.architecturalPerSqft} onChange={(e) => updateValue("architecturalPerSqft", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metalPerSqft">Metal ($/sqft)</Label>
            <Input id="metalPerSqft" type="number" step="0.01" value={values.metalPerSqft} onChange={(e) => updateValue("metalPerSqft", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tilePerSqft">Tile ($/sqft)</Label>
            <Input id="tilePerSqft" type="number" step="0.01" value={values.tilePerSqft} onChange={(e) => updateValue("tilePerSqft", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minimumJobPrice">Minimum Job Price</Label>
            <Input id="minimumJobPrice" type="number" step="1" value={values.minimumJobPrice} onChange={(e) => updateValue("minimumJobPrice", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repairMarkup">Repair Markup (decimal)</Label>
            <Input id="repairMarkup" type="number" step="0.01" value={values.repairMarkup} onChange={(e) => updateValue("repairMarkup", e.target.value)} />
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium">Complexity Multipliers</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="complexitySimple">Simple</Label>
              <Input id="complexitySimple" type="number" step="0.01" value={values.complexitySimple} onChange={(e) => updateValue("complexitySimple", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complexityMedium">Medium</Label>
              <Input id="complexityMedium" type="number" step="0.01" value={values.complexityMedium} onChange={(e) => updateValue("complexityMedium", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="complexityComplex">Complex</Label>
              <Input id="complexityComplex" type="number" step="0.01" value={values.complexityComplex} onChange={(e) => updateValue("complexityComplex", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="button" onClick={saveConfig} disabled={saving}>
            {saving ? "Saving..." : "Save Pricing"}
          </Button>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
