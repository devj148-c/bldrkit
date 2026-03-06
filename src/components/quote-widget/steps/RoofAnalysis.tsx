import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { RoofData } from "@/lib/quote"

const MANUAL_RANGES = [
  { label: "1,000 - 1,500", value: 1250 },
  { label: "1,500 - 2,000", value: 1750 },
  { label: "2,000 - 2,500", value: 2250 },
  { label: "2,500 - 3,000", value: 2750 },
  { label: "3,000+", value: 3200 },
]

interface RoofAnalysisProps {
  loading: boolean
  roofData: RoofData | null
  manualEntryRequired: boolean
  reason?: string | null
  manualSqft: string
  onManualSqftChange: (value: string) => void
  onSelectRange: (value: number) => void
  onContinue: () => void
}

export function RoofAnalysis({
  loading,
  roofData,
  manualEntryRequired,
  reason,
  manualSqft,
  onManualSqftChange,
  onSelectRange,
  onContinue,
}: RoofAnalysisProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyzing Your Roof</CardTitle>
          <CardDescription>Please wait while we scan your property.</CardDescription>
        </CardHeader>
        <CardContent className="py-10">
          <div className="mx-auto h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (manualEntryRequired) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manual Roof Size Entry</CardTitle>
          <CardDescription>
            We couldn&apos;t measure your roof automatically. Enter an approximate roof size to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {reason && <p className="text-sm text-muted-foreground">{reason}</p>}
          <div className="space-y-2">
            <Label htmlFor="manualSqft">Approximate Roof Sq Ft</Label>
            <Input
              id="manualSqft"
              type="number"
              placeholder="e.g. 2200"
              value={manualSqft}
              onChange={(event) => onManualSqftChange(event.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {MANUAL_RANGES.map((range) => (
              <Button key={range.label} type="button" variant="outline" size="sm" onClick={() => onSelectRange(range.value)}>
                {range.label}
              </Button>
            ))}
          </div>
          <div className="flex justify-end">
          <Button disabled={!manualSqft} onClick={onContinue}>
            Continue →
          </Button>
        </div>
        </CardContent>
      </Card>
    )
  }

  if (!roofData) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roof Analysis Complete</CardTitle>
        <CardDescription>We measured your roof from aerial imagery.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Roof Size</p>
            <p className="text-lg font-semibold">{Math.round(roofData.totalSqft).toLocaleString()} sq ft</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Pitch</p>
            <p className="text-lg font-semibold">{roofData.pitchRatio}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Complexity</p>
            <p className="text-lg font-semibold capitalize">{roofData.complexity}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{roofData.segments} sections</Badge>
          <Badge variant="outline">Imagery: {roofData.imageryDate}</Badge>
        </div>
        <div className="flex justify-end">
          <Button onClick={onContinue}>Continue →</Button>
        </div>
      </CardContent>
    </Card>
  )
}
