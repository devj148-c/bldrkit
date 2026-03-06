"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { AddressStep } from "./steps/AddressStep"
import { RoofAnalysis } from "./steps/RoofAnalysis"
import { WorkTypeStep } from "./steps/WorkTypeStep"
import { MaterialStep } from "./steps/MaterialStep"
import { PhotoUploadStep, type QuotePhoto } from "./steps/PhotoUploadStep"
import { EstimateStep } from "./steps/EstimateStep"
import { ContactBookingStep } from "./steps/ContactBookingStep"
import { ConfirmationStep } from "./steps/ConfirmationStep"
import type { MaterialType, RoofData, WorkType } from "@/lib/quote"
import { useRoofMeasurement } from "./hooks/useRoofMeasurement"
import { useQuoteEstimate } from "./hooks/useQuoteEstimate"

interface QuoteWidgetProps {
  companyId?: string
  companyName?: string
  companyPhone?: string
}

const TOTAL_STEPS = 8

export function QuoteWidget({ companyId, companyName, companyPhone }: QuoteWidgetProps) {
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState("")
  const [roofData, setRoofData] = useState<RoofData | null>(null)
  const [manualEntryRequired, setManualEntryRequired] = useState(false)
  const [manualReason, setManualReason] = useState<string | null>(null)
  const [manualSqft, setManualSqft] = useState("")

  const [workType, setWorkType] = useState<WorkType | null>(null)
  const [material, setMaterial] = useState<MaterialType | null>(null)
  const [photos, setPhotos] = useState<QuotePhoto[]>([])

  const [lowEstimate, setLowEstimate] = useState<number | null>(null)
  const [highEstimate, setHighEstimate] = useState<number | null>(null)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [appointmentDate, setAppointmentDate] = useState("")
  const [appointmentSlot, setAppointmentSlot] = useState("morning")
  const [leadId, setLeadId] = useState<string>()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { measure, loading: measureLoading } = useRoofMeasurement()
  const { estimate, loading: estimateLoading } = useQuoteEstimate()

  async function handleAddressSubmit() {
    if (!address.trim()) return

    setStep(2)
    const result = await measure(address)
    if (result.formattedAddress) setAddress(result.formattedAddress)

    if (result.manualEntryRequired) {
      setManualEntryRequired(true)
      setManualReason(result.reason || null)
      setRoofData(null)
      return
    }

    setManualEntryRequired(false)
    setManualReason(null)
    setRoofData({
      totalSqft: result.totalSqft,
      avgPitchDegrees: result.avgPitchDegrees,
      pitchRatio: result.pitchRatio,
      segments: result.segments,
      complexity: result.complexity,
      imageryDate: result.imageryDate,
      lat: result.lat,
      lng: result.lng,
    })
  }

  function handleStep2Continue() {
    if (manualEntryRequired) {
      const sqft = Number(manualSqft)
      if (!sqft || Number.isNaN(sqft)) return
      setRoofData({
        totalSqft: sqft,
        avgPitchDegrees: 20,
        pitchRatio: "4/12",
        segments: 0,
        complexity: "medium",
        imageryDate: "manual",
      })
    }

    setStep(3)
  }

  function handleWorkTypeContinue() {
    if (!workType) return
    if (workType === "replacement" || workType === "unsure") {
      setStep(4)
      return
    }
    setMaterial("unsure")
    setStep(5)
  }

  function handleMaterialContinue() {
    if (!material) return
    setStep(5)
  }

  useEffect(() => {
    async function loadEstimate() {
      if (step !== 6 || !roofData || !workType || !material) return
      const response = await estimate({
        sqft: roofData.totalSqft,
        complexity: roofData.complexity,
        material,
        workType,
        companyId,
      })
      setLowEstimate(response.lowEstimate)
      setHighEstimate(response.highEstimate)
    }

    loadEstimate().catch((error) => {
      console.error("Estimate load failed", error)
    })
  }, [step, roofData, workType, material, companyId, estimate])

  async function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  async function addPhoto(file: File) {
    if (photos.length >= 5) return
    const dataUrl = await fileToDataUrl(file)
    setPhotos((current) => [...current, { filename: file.name, dataUrl, size: file.size }])
  }

  async function handleSubmitLead() {
    if (!roofData || !workType || !material) return

    setSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/quote/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          address,
          roofData,
          material,
          workType,
          lowEstimate,
          highEstimate,
          photos: photos.map((photo) => ({ filename: photo.filename, dataUrl: photo.dataUrl })),
          appointmentDate: appointmentDate || null,
          appointmentSlot,
          companyId,
        }),
      })

      const data = (await response.json()) as { leadId?: string; error?: string }
      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to submit quote")
      }

      setLeadId(data.leadId)
      setStep(8)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Failed to submit quote")
    } finally {
      setSubmitting(false)
    }
  }

  const progress = useMemo(() => Math.round((step / TOTAL_STEPS) * 100), [step])

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 rounded-xl border bg-card p-4 shadow-sm sm:p-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {step} of {TOTAL_STEPS}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="h-2 rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {step === 1 && (
        <AddressStep
          address={address}
          onAddressChange={setAddress}
          onSubmit={handleAddressSubmit}
          disabled={measureLoading}
        />
      )}

      {step === 2 && (
        <RoofAnalysis
          loading={measureLoading}
          roofData={roofData}
          manualEntryRequired={manualEntryRequired}
          reason={manualReason}
          manualSqft={manualSqft}
          onManualSqftChange={setManualSqft}
          onSelectRange={(value) => setManualSqft(String(value))}
          onContinue={handleStep2Continue}
        />
      )}

      {step === 3 && (
        <WorkTypeStep value={workType} onChange={setWorkType} onContinue={handleWorkTypeContinue} />
      )}

      {step === 4 && (
        <MaterialStep value={material} onChange={setMaterial} onContinue={handleMaterialContinue} />
      )}

      {step === 5 && (
        <PhotoUploadStep
          photos={photos}
          onAddPhoto={addPhoto}
          onRemovePhoto={(index) => setPhotos((current) => current.filter((_, i) => i !== index))}
          onContinue={() => setStep(6)}
        />
      )}

      {step === 6 && (
        <EstimateStep
          loading={estimateLoading}
          lowEstimate={lowEstimate}
          highEstimate={highEstimate}
          companyName={companyName}
          onContinue={() => setStep(7)}
        />
      )}

      {step === 7 && (
        <ContactBookingStep
          name={name}
          phone={phone}
          email={email}
          appointmentDate={appointmentDate}
          appointmentSlot={appointmentSlot}
          onChange={(field, value) => {
            if (field === "name") setName(value)
            if (field === "phone") setPhone(value)
            if (field === "email") setEmail(value)
            if (field === "appointmentDate") setAppointmentDate(value)
            if (field === "appointmentSlot") setAppointmentSlot(value)
          }}
          onSubmit={handleSubmitLead}
          submitting={submitting}
        />
      )}

      {step === 8 && <ConfirmationStep leadId={leadId} phone={companyPhone} />}

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      {step > 1 && step < 8 && (
        <Button variant="ghost" type="button" onClick={() => setStep((current) => Math.max(1, current - 1))}>
          Back
        </Button>
      )}
    </div>
  )
}
