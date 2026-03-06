import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

interface EstimateStepProps {
  loading: boolean
  lowEstimate: number | null
  highEstimate: number | null
  companyName?: string
  onContinue: () => void
}

export function EstimateStep({ loading, lowEstimate, highEstimate, companyName, onContinue }: EstimateStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Instant Estimate</CardTitle>
        <CardDescription>Based on aerial measurements and your selected project details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="py-10 text-center text-muted-foreground">Calculating your estimate...</div>
        ) : (
          <>
            <div className="rounded-lg border bg-primary/5 p-6 text-center">
              <p className="text-sm text-muted-foreground">Estimated Cost</p>
              <p className="text-2xl font-bold sm:text-3xl">
                {formatCurrency(lowEstimate || 0)} - {formatCurrency(highEstimate || 0)}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              This is a preliminary estimate based on aerial measurements. Your final quote will be confirmed after an on-site inspection.
            </p>
            <p className="text-xs text-muted-foreground">
              Estimate provided by {companyName || "your local roofer"}. Actual pricing may vary.
            </p>
          </>
        )}
        <Button className="w-full" onClick={onContinue} disabled={loading || lowEstimate === null || highEstimate === null}>
          Continue to Booking
        </Button>
      </CardContent>
    </Card>
  )
}
