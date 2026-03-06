import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { WorkType } from "@/lib/quote"

const OPTIONS: Array<{ value: WorkType; title: string; description: string }> = [
  { value: "replacement", title: "Full Roof Replacement", description: "Install a complete new roofing system" },
  { value: "repair", title: "Roof Repair", description: "Fix leaks, damage, or isolated issues" },
  { value: "storm", title: "Storm / Hail Damage", description: "Assess and repair weather-related damage" },
  { value: "inspection", title: "Inspection Only", description: "Free inspection and professional recommendation" },
  { value: "unsure", title: "Not Sure", description: "I need an expert recommendation" },
]

interface WorkTypeStepProps {
  value: WorkType | null
  onChange: (value: WorkType) => void
  onContinue: () => void
}

export function WorkTypeStep({ value, onChange, onContinue }: WorkTypeStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>What Do You Need?</CardTitle>
        <CardDescription>Select the option that best matches your situation.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "w-full rounded-lg border p-4 text-left transition",
              value === option.value ? "border-primary bg-primary/5" : "hover:border-primary/40"
            )}
          >
            <p className="font-medium">{option.title}</p>
            <p className="text-sm text-muted-foreground">{option.description}</p>
          </button>
        ))}
        <div className="flex justify-end">
          <Button disabled={!value} onClick={onContinue}>Continue →</Button>
        </div>
      </CardContent>
    </Card>
  )
}
