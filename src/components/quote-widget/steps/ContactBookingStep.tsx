import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

interface ContactBookingStepProps {
  name: string
  phone: string
  email: string
  appointmentDate: string
  appointmentSlot: string
  onChange: (field: "name" | "phone" | "email" | "appointmentDate" | "appointmentSlot", value: string) => void
  onSubmit: () => void
  submitting?: boolean
}

export function ContactBookingStep({
  name,
  phone,
  email,
  appointmentDate,
  appointmentSlot,
  onChange,
  onSubmit,
  submitting,
}: ContactBookingStepProps) {
  const canSubmit = Boolean(name.trim() && phone.trim() && email.trim())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Info and Inspection Booking</CardTitle>
        <CardDescription>Book your free inspection and we&apos;ll confirm your appointment quickly.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(event) => onChange("name", event.target.value)} placeholder="Jane Homeowner" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={phone} onChange={(event) => onChange("phone", event.target.value)} placeholder="(555) 123-4567" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(event) => onChange("email", event.target.value)} placeholder="you@email.com" />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="appointmentDate">Preferred Date</Label>
            <Input
              id="appointmentDate"
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={appointmentDate}
              onChange={(event) => onChange("appointmentDate", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="appointmentSlot">Preferred Time</Label>
            <Select id="appointmentSlot" value={appointmentSlot} onChange={(event) => onChange("appointmentSlot", event.target.value)}>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </Select>
          </div>
        </div>

        <div className="rounded-md bg-muted p-3 text-sm">
          <p>Licensed and insured</p>
          <p>Free inspection, no obligation</p>
          <p>We&apos;ll confirm your appointment within 1 hour</p>
        </div>

        <Button className="w-full" onClick={onSubmit} disabled={!canSubmit || submitting}>
          {submitting ? "Submitting..." : "Book My Free Inspection"}
        </Button>
      </CardContent>
    </Card>
  )
}
