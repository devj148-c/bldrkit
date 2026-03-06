"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Wrench,
  MapPin,
  Palette,
  CheckCircle2,
  Loader2,
  Globe,
  Phone,
  Mail,
  Clock,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: 1, label: "Company Info", icon: Building2 },
  { id: 2, label: "Services", icon: Wrench },
  { id: 3, label: "Service Area", icon: MapPin },
  { id: 4, label: "Template", icon: Palette },
  { id: 5, label: "Review", icon: CheckCircle2 },
  { id: 6, label: "Generating", icon: Loader2 },
]

const CORE_SERVICES = [
  "Roof Replacement",
  "Roof Repair",
  "Emergency Roof Repair / Leak Repair",
  "Roof Inspection",
  "Storm Damage Repair",
  "Insurance Claim Assistance",
]

const MATERIAL_SERVICES = [
  "Asphalt Shingle Roofing",
  "Metal Roofing",
  "Tile Roofing",
  "Flat Roofing (TPO, EPDM, Modified Bitumen)",
  "Cedar Shake Roofing",
  "Slate Roofing",
  "Synthetic / Composite Roofing",
]

const ADDITIONAL_SERVICES = [
  "Gutter Installation & Repair",
  "Siding Installation & Repair",
  "Skylight Installation",
  "Attic Insulation",
  "Roof Ventilation",
  "Chimney Repair / Flashing",
  "Commercial Roofing",
  "New Construction Roofing",
]

const TEMPLATES = [
  {
    id: "storm-shield",
    name: "Storm Shield",
    description: "Bold, high-contrast. Great for storm restoration companies.",
    colors: { primary: "#ef4444", accent: "#f97316" },
    preview: "🛡️",
  },
  {
    id: "craftsman",
    name: "Craftsman",
    description: "Warm, trustworthy. Great for family-owned companies.",
    colors: { primary: "#d97706", accent: "#92400e" },
    preview: "🏠",
  },
  {
    id: "modern-pro",
    name: "Modern Pro",
    description: "Clean, minimal. Great for commercial roofers.",
    colors: { primary: "#3b82f6", accent: "#1d4ed8" },
    preview: "🏢",
  },
  {
    id: "neighborhood",
    name: "Neighborhood",
    description: "Friendly, local feel. Great for residential specialists.",
    colors: { primary: "#22c55e", accent: "#16a34a" },
    preview: "🏡",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Luxury aesthetic. Great for high-end custom roofing.",
    colors: { primary: "#8b5cf6", accent: "#6d28d9" },
    preview: "✨",
  },
]

const GENERATION_STEPS = [
  "Setting up your website...",
  "Generating homepage content...",
  "Creating service pages...",
  "Building service area pages...",
  "Writing About Us page...",
  "Generating FAQ content...",
  "Optimizing SEO metadata...",
  "Adding schema markup...",
  "Creating blog post outlines...",
  "Finalizing your website...",
]

interface OnboardingData {
  companyName: string
  phone: string
  email: string
  address: string
  city: string
  state: string
  zip: string
  yearsInBusiness: string
  licenseNumber: string
  insuranceInfo: string
  businessHours: string
  services: string[]
  primaryCity: string
  additionalCities: string
  serviceRadius: string
  templateId: string
}

export function SetupWizard() {
  const [step, setStep] = useState(1)
  const [generationStep, setGenerationStep] = useState(0)
  const [generationComplete, setGenerationComplete] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    companyName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    yearsInBusiness: "",
    licenseNumber: "",
    insuranceInfo: "",
    businessHours: "Mon-Fri 7:00 AM - 6:00 PM, Sat 8:00 AM - 2:00 PM",
    services: [],
    primaryCity: "",
    additionalCities: "",
    serviceRadius: "25",
    templateId: "",
  })

  const updateData = (field: keyof OnboardingData, value: string | string[]) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleService = (service: string) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.companyName && data.phone && data.email && data.city && data.state
      case 2:
        return data.services.length > 0
      case 3:
        return data.primaryCity
      case 4:
        return data.templateId
      case 5:
        return true
      default:
        return false
    }
  }

  const handleGenerate = async () => {
    setStep(6)
    // Simulate generation progress
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600))
      setGenerationStep(i + 1)
    }
    setGenerationComplete(true)
    // In reality, call the API
    try {
      await fetch("/api/website-builder/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
    } catch {
      // Silently handle — the mock will still show success
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                step >= s.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/30 text-muted-foreground"
              )}
            >
              <s.icon className="h-4 w-4" />
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-8 sm:w-16 mx-1",
                  step > s.id ? "bg-primary" : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Company Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" /> Company Information
            </CardTitle>
            <CardDescription>
              Tell us about your roofing company. This info will appear on your website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Acme Roofing Co."
                  value={data.companyName}
                  onChange={(e) => updateData("companyName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Phone Number *
                </Label>
                <Input
                  id="phone"
                  placeholder="(555) 123-4567"
                  value={data.phone}
                  onChange={(e) => updateData("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="info@acmeroofing.com"
                  value={data.email}
                  onChange={(e) => updateData("email", e.target.value)}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="123 Main St"
                  value={data.address}
                  onChange={(e) => updateData("address", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="Dallas"
                  value={data.city}
                  onChange={(e) => updateData("city", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    placeholder="TX"
                    value={data.state}
                    onChange={(e) => updateData("state", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP</Label>
                  <Input
                    id="zip"
                    placeholder="75001"
                    value={data.zip}
                    onChange={(e) => updateData("zip", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearsInBusiness">Years in Business</Label>
                <Input
                  id="yearsInBusiness"
                  placeholder="15"
                  value={data.yearsInBusiness}
                  onChange={(e) => updateData("yearsInBusiness", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  placeholder="ROC-12345"
                  value={data.licenseNumber}
                  onChange={(e) => updateData("licenseNumber", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="insuranceInfo">Insurance Info</Label>
                <Input
                  id="insuranceInfo"
                  placeholder="Fully insured & bonded"
                  value={data.insuranceInfo}
                  onChange={(e) => updateData("insuranceInfo", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessHours" className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Business Hours
              </Label>
              <Input
                id="businessHours"
                placeholder="Mon-Fri 7:00 AM - 6:00 PM"
                value={data.businessHours}
                onChange={(e) => updateData("businessHours", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Upload className="h-3 w-3" /> Company Logo
              </Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop your logo here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Services */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" /> Services You Offer
            </CardTitle>
            <CardDescription>
              Select all the services your company provides. Each one becomes its own SEO-optimized page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Core Services
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CORE_SERVICES.map((service) => (
                  <ServiceCheckbox
                    key={service}
                    label={service}
                    checked={data.services.includes(service)}
                    onChange={() => toggleService(service)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Material Specialties
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MATERIAL_SERVICES.map((service) => (
                  <ServiceCheckbox
                    key={service}
                    label={service}
                    checked={data.services.includes(service)}
                    onChange={() => toggleService(service)}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
                Additional Services
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ADDITIONAL_SERVICES.map((service) => (
                  <ServiceCheckbox
                    key={service}
                    label={service}
                    checked={data.services.includes(service)}
                    onChange={() => toggleService(service)}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              {data.services.length} service{data.services.length !== 1 ? "s" : ""} selected
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Service Area */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" /> Service Area
            </CardTitle>
            <CardDescription>
              Tell us where you work. Each city gets its own landing page for local SEO.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="primaryCity">Primary City *</Label>
              <Input
                id="primaryCity"
                placeholder={data.city || "Dallas"}
                value={data.primaryCity || data.city}
                onChange={(e) => updateData("primaryCity", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your main market — this will be the primary city in your SEO targeting.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalCities">Additional Cities Served</Label>
              <Textarea
                id="additionalCities"
                placeholder="Plano, Frisco, McKinney, Allen, Richardson, Garland..."
                value={data.additionalCities}
                onChange={(e) => updateData("additionalCities", e.target.value)}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Separate cities with commas. Each one becomes a service area landing page.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="serviceRadius">Service Radius (miles)</Label>
              <Input
                id="serviceRadius"
                type="number"
                placeholder="25"
                value={data.serviceRadius}
                onChange={(e) => updateData("serviceRadius", e.target.value)}
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Template Selection */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" /> Choose Your Template
            </CardTitle>
            <CardDescription>
              Pick a design that matches your brand. You can customize colors and content later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => updateData("templateId", template.id)}
                  className={cn(
                    "relative rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50",
                    data.templateId === template.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border"
                  )}
                >
                  {data.templateId === template.id && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div
                    className="h-32 rounded-md mb-3 flex items-center justify-center text-4xl"
                    style={{
                      background: `linear-gradient(135deg, ${template.colors.primary}20, ${template.colors.accent}20)`,
                    }}
                  >
                    {template.preview}
                  </div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                  <div className="flex gap-1 mt-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: template.colors.primary }}
                    />
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: template.colors.accent }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" /> Review Your Website Setup
            </CardTitle>
            <CardDescription>
              Everything look good? Hit generate and we&apos;ll build your entire website.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Company
                </h3>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{data.companyName}</p>
                  <p className="text-muted-foreground">{data.phone}</p>
                  <p className="text-muted-foreground">{data.email}</p>
                  <p className="text-muted-foreground">
                    {[data.address, data.city, data.state, data.zip].filter(Boolean).join(", ")}
                  </p>
                  {data.yearsInBusiness && (
                    <p className="text-muted-foreground">{data.yearsInBusiness} years in business</p>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Service Area
                </h3>
                <div className="text-sm space-y-1">
                  <p>
                    <span className="text-muted-foreground">Primary:</span>{" "}
                    {data.primaryCity || data.city}, {data.state}
                  </p>
                  {data.additionalCities && (
                    <p>
                      <span className="text-muted-foreground">Also serving:</span>{" "}
                      {data.additionalCities}
                    </p>
                  )}
                  <p className="text-muted-foreground">{data.serviceRadius} mile radius</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Wrench className="h-4 w-4" /> Services ({data.services.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.services.map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4" /> Template
              </h3>
              <p className="text-sm">
                {TEMPLATES.find((t) => t.id === data.templateId)?.name} —{" "}
                <span className="text-muted-foreground">
                  {TEMPLATES.find((t) => t.id === data.templateId)?.description}
                </span>
              </p>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold mb-2">🚀 What we&apos;ll generate:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SEO-optimized homepage</li>
                <li>• {data.services.length} service page{data.services.length !== 1 ? "s" : ""}</li>
                <li>
                  •{" "}
                  {(data.additionalCities ? data.additionalCities.split(",").length : 0) + 1} service
                  area page{(data.additionalCities ? data.additionalCities.split(",").length : 0) > 0 ? "s" : ""}
                </li>
                <li>• About Us, FAQ, Contact, and Gallery pages</li>
                <li>• Schema markup for Google rich results</li>
                <li>• Booking widget for appointment scheduling</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Generation */}
      {step === 6 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {generationComplete ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-500" /> Website Generated!
                </>
              ) : (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Building Your Website...
                </>
              )}
            </CardTitle>
            <CardDescription>
              {generationComplete
                ? "Your website is ready. Head to the dashboard to preview and publish."
                : "AI is creating your pages, content, and SEO metadata. This takes about a minute."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{
                    width: `${(generationStep / GENERATION_STEPS.length) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {generationComplete
                  ? "Complete!"
                  : generationStep > 0
                    ? GENERATION_STEPS[generationStep - 1]
                    : "Starting..."}
              </p>
            </div>

            {/* Step list */}
            <div className="space-y-2">
              {GENERATION_STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2 text-sm">
                  {i < generationStep ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  ) : i === generationStep && !generationComplete ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-muted-foreground/30 shrink-0" />
                  )}
                  <span className={cn(i < generationStep ? "text-foreground" : "text-muted-foreground")}>
                    {s}
                  </span>
                </div>
              ))}
            </div>

            {generationComplete && (
              <div className="flex gap-3">
                <Button
                  onClick={() => (window.location.href = "/website-builder")}
                  className="flex-1"
                >
                  <Globe className="h-4 w-4 mr-2" /> Go to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      {step < 6 && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          {step < 5 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
            >
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleGenerate} className="bg-green-600 hover:bg-green-700">
              🚀 Generate My Website
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

function ServiceCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-all",
        checked
          ? "border-primary bg-primary/5 text-foreground"
          : "border-border hover:border-primary/30 text-muted-foreground"
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
          checked ? "border-primary bg-primary" : "border-muted-foreground/40"
        )}
      >
        {checked && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
      </div>
      {label}
    </button>
  )
}
