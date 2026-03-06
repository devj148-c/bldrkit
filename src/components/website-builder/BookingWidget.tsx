"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CalendarDays,
  MessageSquare,
  Phone,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

const BOOKING_SERVICES = [
  "Roof Inspection",
  "Roof Repair",
  "Roof Replacement",
  "Storm Damage Assessment",
  "Gutter Services",
  "Emergency Repair",
  "Other",
]

const TIME_SLOTS = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
]

interface BookingWidgetProps {
  companyPhone?: string
  companyName?: string
  services?: string[]
}

export function BookingWidget({
  companyPhone = "(555) 123-4567",
  companyName = "Your Roofer",
  services,
}: BookingWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<"menu" | "book" | "text" | "call">("menu")
  const [bookStep, setBookStep] = useState(1)
  const [booked, setBooked] = useState(false)
  const [formData, setFormData] = useState({
    service: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    date: "",
    time: "",
  })

  const bookingServices = services || BOOKING_SERVICES
  const phoneClean = companyPhone.replace(/\D/g, "")

  const handleBook = async () => {
    try {
      await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerEmail: formData.email,
          customerAddress: formData.address,
          serviceRequested: formData.service,
          scheduledDate: formData.date,
          scheduledTime: formData.time,
          notes: formData.notes,
          source: "widget",
        }),
      })
    } catch {
      // Still show success in the UI
    }
    setBooked(true)
  }

  const reset = () => {
    setView("menu")
    setBookStep(1)
    setBooked(false)
    setFormData({
      service: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      date: "",
      time: "",
    })
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
      >
        <CalendarDays className="h-5 w-5" />
        <span className="font-semibold text-sm">Book Now</span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[360px] max-h-[600px]">
      <Card className="shadow-2xl border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              {view === "menu" && "How can we help?"}
              {view === "book" && !booked && "Book an Appointment"}
              {view === "book" && booked && "Appointment Booked!"}
              {view === "text" && "Text Us"}
              {view === "call" && "Call Us"}
            </CardTitle>
            <button
              onClick={() => {
                setIsOpen(false)
                reset()
              }}
              className="p-1 rounded-md hover:bg-accent transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Main Menu */}
          {view === "menu" && (
            <div className="space-y-3">
              <button
                onClick={() => setView("book")}
                className="w-full flex items-center gap-3 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <CalendarDays className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Book Appointment</p>
                  <p className="text-xs text-muted-foreground">Schedule a time that works</p>
                </div>
              </button>
              <a
                href={`sms:+1${phoneClean}?body=${encodeURIComponent(`Hi, I found ${companyName} on your website and I'd like to learn more about your services.`)}`}
                className="w-full flex items-center gap-3 p-4 rounded-lg border hover:border-green-500 hover:bg-green-500/5 transition-all text-left block"
                onClick={(e) => {
                  // On desktop, prevent default and show the text view
                  if (!/Mobi|Android/i.test(navigator.userAgent)) {
                    e.preventDefault()
                    setView("text")
                  }
                }}
              >
                <div className="p-2 rounded-lg bg-green-500/10">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Text Us</p>
                  <p className="text-xs text-muted-foreground">Quick question? Send a text</p>
                </div>
              </a>
              <a
                href={`tel:+1${phoneClean}`}
                className="w-full flex items-center gap-3 p-4 rounded-lg border hover:border-blue-500 hover:bg-blue-500/5 transition-all text-left block"
              >
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Phone className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Call Us</p>
                  <p className="text-xs text-muted-foreground">{companyPhone}</p>
                </div>
              </a>
            </div>
          )}

          {/* Text Us (Desktop) */}
          {view === "text" && (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your phone to send us a text:
              </p>
              <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center border">
                {/* QR code placeholder — would use qrcode package */}
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">QR Code</p>
                  <p className="text-[10px] text-gray-400 mt-1">sms:+1{phoneClean}</p>
                </div>
              </div>
              <p className="text-sm">
                Or text us directly at{" "}
                <a href={`sms:+1${phoneClean}`} className="text-primary font-semibold">
                  {companyPhone}
                </a>
              </p>
              <Button variant="ghost" size="sm" onClick={() => setView("menu")}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </div>
          )}

          {/* Call Us (Desktop) */}
          {view === "call" && (
            <div className="space-y-4 text-center">
              <Phone className="h-12 w-12 text-primary mx-auto" />
              <p className="text-lg font-semibold">{companyPhone}</p>
              <a href={`tel:+1${phoneClean}`}>
                <Button className="w-full">
                  <Phone className="h-4 w-4 mr-2" /> Call Now
                </Button>
              </a>
              <Button variant="ghost" size="sm" onClick={() => setView("menu")}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            </div>
          )}

          {/* Book Appointment Flow */}
          {view === "book" && !booked && (
            <div>
              {/* Step 1: Select Service */}
              {bookStep === 1 && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">What do you need help with?</p>
                  {bookingServices.map((service) => (
                    <button
                      key={service}
                      onClick={() => {
                        setFormData((d) => ({ ...d, service }))
                        setBookStep(2)
                      }}
                      className={cn(
                        "w-full text-left p-3 rounded-lg border text-sm transition-all hover:border-primary hover:bg-primary/5",
                        formData.service === service && "border-primary bg-primary/5"
                      )}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              )}

              {/* Step 2: Your Info */}
              {bookStep === 2 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-1">Tell us about yourself</p>
                  <Input
                    placeholder="Your name *"
                    value={formData.name}
                    onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Phone number *"
                    value={formData.phone}
                    onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                  />
                  <Input
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                  />
                  <Input
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData((d) => ({ ...d, address: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Brief description of the issue (optional)"
                    value={formData.notes}
                    onChange={(e) => setFormData((d) => ({ ...d, notes: e.target.value }))}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setBookStep(1)}>
                      <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => setBookStep(3)}
                      disabled={!formData.name || !formData.phone}
                    >
                      Next <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {bookStep === 3 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-1">Pick a date and time</p>
                  <div className="space-y-2">
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData((d) => ({ ...d, date: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  {formData.date && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Available times:
                      </p>
                      <div className="grid grid-cols-4 gap-1">
                        {TIME_SLOTS.map((time) => (
                          <button
                            key={time}
                            onClick={() => setFormData((d) => ({ ...d, time }))}
                            className={cn(
                              "text-xs py-2 px-1 rounded border transition-all",
                              formData.time === time
                                ? "border-primary bg-primary text-primary-foreground"
                                : "hover:border-primary"
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => setBookStep(2)}>
                      <ArrowLeft className="h-4 w-4 mr-1" /> Back
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={handleBook}
                      disabled={!formData.date || !formData.time}
                    >
                      Book Appointment
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Confirmation */}
          {view === "book" && booked && (
            <div className="space-y-4 text-center py-2">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Service:</span> {formData.service}
                </p>
                <p>
                  <span className="text-muted-foreground">Date:</span> {formData.date}
                </p>
                <p>
                  <span className="text-muted-foreground">Time:</span> {formData.time}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                We&apos;ll send a confirmation to {formData.phone}
              </p>
              <p className="text-xs text-muted-foreground">
                Questions? Call us at {companyPhone}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false)
                  reset()
                }}
              >
                Close
              </Button>
            </div>
          )}

          {/* Back to menu from booking */}
          {view === "book" && !booked && bookStep === 1 && (
            <Button variant="ghost" size="sm" className="mt-3" onClick={() => setView("menu")}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
