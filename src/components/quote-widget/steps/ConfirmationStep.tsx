import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ConfirmationStepProps {
  leadId?: string
  phone?: string
}

export function ConfirmationStep({ leadId, phone }: ConfirmationStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>You&apos;re All Set</CardTitle>
        <CardDescription>Your request is in. A roofer will contact you soon to confirm your appointment.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {leadId && (
          <p className="text-sm text-muted-foreground">
            Confirmation ID: <span className="font-medium text-foreground">{leadId}</span>
          </p>
        )}
        <div className="rounded-lg border bg-primary/5 p-4 text-sm">
          <p className="font-medium">Need immediate help?</p>
          <p>Call us at {phone || "(555) 123-4567"}</p>
        </div>
        <Button className="w-full" onClick={() => (window.location.href = "/")}>Return Home</Button>
      </CardContent>
    </Card>
  )
}
