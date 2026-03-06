"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useEffect, useRef, useState, useCallback } from "react"
import { MapPin } from "lucide-react"

interface AddressStepProps {
  address: string
  onAddressChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function AddressStep({ address, onAddressChange, onSubmit, disabled }: AddressStepProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [apiLoaded, setApiLoaded] = useState(false)
  const autocompleteRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null)
  const stableOnAddressChange = useCallback(onAddressChange, [onAddressChange])

  // Load Google Maps JS API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!apiKey) return

    // If already loaded
    if (typeof window !== "undefined" && window.google?.maps) {
      setApiLoaded(true)
      return
    }

    const existing = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existing) {
      existing.addEventListener("load", () => setApiLoaded(true))
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`
    script.async = true
    script.defer = true
    script.onload = () => setApiLoaded(true)
    document.head.appendChild(script)
  }, [])

  // Initialize PlaceAutocompleteElement (New API)
  useEffect(() => {
    if (!apiLoaded || !containerRef.current || autocompleteRef.current) return

    async function init() {
      try {
        await google.maps.importLibrary("places")

        const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({
          componentRestrictions: { country: "us" },
        })

        // Style the element to match our design
        placeAutocomplete.style.width = "100%"
        placeAutocomplete.setAttribute("placeholder", "Start typing your address...")

        // Listen for place selection
        placeAutocomplete.addEventListener("gmp-select", async (event: any) => {
          const placePrediction = event.placePrediction
          if (!placePrediction) return

          const place = placePrediction.toPlace()
          await place.fetchFields({ fields: ["formattedAddress", "location", "addressComponents"] })
          
          if (place.formattedAddress) {
            stableOnAddressChange(place.formattedAddress)
          }
        })

        // Clear the container and append
        if (containerRef.current) {
          containerRef.current.innerHTML = ""
          containerRef.current.appendChild(placeAutocomplete)
          autocompleteRef.current = placeAutocomplete
        }
      } catch (err) {
        console.error("Failed to init Places Autocomplete:", err)
      }
    }

    init()
  }, [apiLoaded, stableOnAddressChange])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

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
          {apiKey ? (
            <>
              {/* Google Places Autocomplete (New API) renders here */}
              <div 
                ref={containerRef} 
                className="[&_gmp-place-autocomplete]:w-full [&_input]:h-12 [&_input]:text-base [&_input]:rounded-md [&_input]:border [&_input]:border-input [&_input]:bg-background [&_input]:px-3 [&_input]:py-2 [&_input]:ring-offset-background [&_input]:focus-visible:outline-none [&_input]:focus-visible:ring-2 [&_input]:focus-visible:ring-ring"
              />
              {/* Hidden input to track selected address for form state */}
              {address && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {address}
                </p>
              )}
            </>
          ) : (
            <>
              {/* Fallback: plain text input when no API key */}
              <input
                id="address"
                value={address}
                onChange={(event) => onAddressChange(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && address.trim()) onSubmit()
                }}
                placeholder="123 Main St, Austin, TX 78701"
                className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <p className="text-xs text-muted-foreground">
                Enter your full street address including city and state
              </p>
            </>
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
