import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddressStepProps {
  address: string
  onAddressChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function AddressStep({ address, onAddressChange, onSubmit, disabled }: AddressStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Get Your Instant Roof Estimate</CardTitle>
        <CardDescription>Enter your property address to measure your roof from aerial imagery.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
            placeholder="123 Main St, Austin, TX 78701"
          />
        </div>
        <Button className="w-full" onClick={onSubmit} disabled={disabled || !address.trim()}>
          Get My Instant Estimate
        </Button>
      </CardContent>
    </Card>
  )
}
