import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MaterialType } from "@/lib/quote"

const MATERIALS: Array<{ value: MaterialType; label: string; detail: string }> = [
  { value: "3tab", label: "3-Tab Shingles", detail: "Budget-friendly · $" },
  { value: "architectural", label: "Architectural Shingles", detail: "Most popular · $$" },
  { value: "metal", label: "Metal Roofing", detail: "Premium durability · $$$" },
  { value: "tile", label: "Tile", detail: "High-end · $$$$" },
  { value: "unsure", label: "Not Sure", detail: "Recommend the best fit" },
]

interface MaterialStepProps {
  value: MaterialType | null
  onChange: (value: MaterialType) => void
  onContinue: () => void
}

export function MaterialStep({ value, onChange, onContinue }: MaterialStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Material Preference</CardTitle>
        <CardDescription>Choose your preferred roofing material.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {MATERIALS.map((material) => (
          <button
            key={material.value}
            type="button"
            onClick={() => onChange(material.value)}
            className={cn(
              "w-full rounded-lg border p-4 text-left transition",
              value === material.value ? "border-primary bg-primary/5" : "hover:border-primary/40"
            )}
          >
            <p className="font-medium">{material.label}</p>
            <p className="text-sm text-muted-foreground">{material.detail}</p>
          </button>
        ))}
        <div className="flex justify-end">
          <Button disabled={!value} onClick={onContinue}>Continue →</Button>
        </div>
      </CardContent>
    </Card>
  )
}
