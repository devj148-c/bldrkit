"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useRef, useState, useCallback } from "react"
import { MapPin, Loader2 } from "lucide-react"

interface AddressStepProps {
  address: string
  onAddressChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

// Simple script loader - no npm package needed
function loadGoogleMapsScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places?.Autocomplete) {
      resolve()
      return
    }

    const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]') as HTMLScriptElement | null
    if (existing) {
      if (window.google?.maps?.places?.Autocomplete) {
        resolve()
        return
      }
      existing.addEventListener("load", () => resolve())
      existing.addEventListener("error", () => reject(new Error("Google Maps script failed")))
      return
    }

    const callbackName = "__initGMaps_" + Date.now()
    ;(window as any)[callbackName] = () => {
      delete (window as any)[callbackName]
      resolve()
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=${callbackName}`
    script.async = true
    script.defer = true
    script.onerror = () => {
      delete (window as any)[callbackName]
      reject(new Error("Failed to load Google Maps"))
    }
    document.head.appendChild(script)
  })
}

export function AddressStep({ address, onAddressChange, onSubmit, disabled }: AddressStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [loading, setLoading] = useState(true)
  const [fallback, setFallback] = useState(false)
  const stableOnAddressChange = useCallback(onAddressChange, [onAddressChange])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

  useEffect(() => {
    if (!apiKey) {
      setFallback(true)
      setLoading(false)
      return
    }

    if (autocompleteRef.current) {
      setLoading(false)
      return
    }

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (!inputRef.current || autocompleteRef.current) return

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ["address"],
          componentRestrictions: { country: "us" },
          fields: ["formatted_address", "geometry", "address_components"],
        })

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace()
          if (place?.formatted_address) {
            stableOnAddressChange(place.formatted_address)
          }
        })

        autocompleteRef.current = autocomplete
        setLoading(false)
      })
      .catch((err) => {
        console.error("Google Maps load error:", err)
        setFallback(true)
        setLoading(false)
      })
  }, [apiKey, stableOnAddressChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const pac = document.querySelector(".pac-container")
      const visible = pac && (pac as HTMLElement).style.display !== "none"
      if (visible) {
        e.preventDefault()
        return
      }
      if (address.trim()) {
        onSubmit()
      }
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">Get Your Instant Roof Estimate</CardTitle>
        <CardDescription className="text-base">
          Enter your address — we&apos;ll measure your roof from aerial imagery and give you a ballpark price in under 60 seconds.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Property Address</Label>
          <div className="relative">
            <Input
              ref={inputRef}
              id="address"
              onKeyDown={handleKeyDown}
              placeholder={loading && !fallback ? "Loading address search..." : "Start typing your address..."}
              className="h-12 text-base pr-10"
              autoComplete="off"
              disabled={loading && !fallback}
            />
            {loading && !fallback && (
              <Loader2 className="absolute right-3 top-3.5 h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
          {address && (
            <p className="text-sm text-green-500 flex items-center gap-1.5 mt-1">
              <MapPin className="h-3.5 w-3.5" />
              {address}
            </p>
          )}
          {fallback && !address && (
            <p className="text-xs text-muted-foreground">
              Enter your full street address including city and state
            </p>
          )}
        </div>
        <div className="flex justify-end">
          <Button
            className="h-12 px-8 text-base font-semibold"
            onClick={onSubmit}
            disabled={disabled || !address.trim()}
          >
            Measure My Roof →
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          Free estimate · No obligation · Takes 60 seconds
        </p>
      </CardContent>
    </Card>
  )
}
