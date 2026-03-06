"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useRef, useState, useCallback } from "react"
import { MapPin } from "lucide-react"

interface AddressStepProps {
  address: string
  onAddressChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

// Load Maps JS API using the dynamic bootstrap loader (required for Places API New)
function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (window.google?.maps?.places?.PlaceAutocompleteElement) {
      resolve()
      return
    }

    // Use the Google-recommended inline bootstrap
    // See: https://developers.google.com/maps/documentation/javascript/load-maps-js-api
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      // Wait for existing script
      const check = setInterval(() => {
        if (window.google?.maps?.places?.PlaceAutocompleteElement) {
          clearInterval(check)
          resolve()
        }
      }, 100)
      setTimeout(() => { clearInterval(check); reject(new Error("Timeout loading Google Maps")) }, 10000)
      return
    }

    // Load via importLibrary bootstrap (supports async loading + new APIs)
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&callback=__gmapsCallback`
    script.async = true
    script.defer = true

    // Global callback
    ;(window as any).__gmapsCallback = () => {
      delete (window as any).__gmapsCallback
      resolve()
    }

    script.onerror = () => reject(new Error("Failed to load Google Maps script"))
    document.head.appendChild(script)
  })
}

export function AddressStep({ address, onAddressChange, onSubmit, disabled }: AddressStepProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [fallback, setFallback] = useState(false)
  const autocompleteRef = useRef<any>(null)
  const stableOnAddressChange = useCallback(onAddressChange, [onAddressChange])

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

  // Load Google Maps + init autocomplete
  useEffect(() => {
    if (!apiKey) {
      setFallback(true)
      return
    }

    let cancelled = false

    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled || !containerRef.current || autocompleteRef.current) return

        const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({
          componentRestrictions: { country: "us" },
        })

        placeAutocomplete.style.width = "100%"
        placeAutocomplete.setAttribute("placeholder", "Start typing your address...")

        placeAutocomplete.addEventListener("gmp-select", async (event: any) => {
          const placePrediction = event.placePrediction
          if (!placePrediction) return

          const place = placePrediction.toPlace()
          await place.fetchFields({ fields: ["formattedAddress", "location", "addressComponents"] })

          if (place.formattedAddress) {
            stableOnAddressChange(place.formattedAddress)
          }
        })

        if (containerRef.current) {
          containerRef.current.innerHTML = ""
          containerRef.current.appendChild(placeAutocomplete)
          autocompleteRef.current = placeAutocomplete
          setReady(true)
        }
      })
      .catch((err) => {
        console.error("Google Maps load error:", err)
        setFallback(true)
      })

    return () => { cancelled = true }
  }, [apiKey, stableOnAddressChange])

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

          {!fallback ? (
            <>
              {/* Google Places Autocomplete (New API) renders here */}
              <div
                ref={containerRef}
                className="[&_gmp-place-autocomplete]:w-full [&_input]:h-12 [&_input]:text-base [&_input]:rounded-md [&_input]:border [&_input]:border-input [&_input]:bg-background [&_input]:px-3 [&_input]:py-2 [&_input]:ring-offset-background [&_input]:focus-visible:outline-none [&_input]:focus-visible:ring-2 [&_input]:focus-visible:ring-ring"
              >
                {!ready && (
                  <Input
                    placeholder="Loading address search..."
                    disabled
                    className="h-12 text-base"
                  />
                )}
              </div>
              {address && (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {address}
                </p>
              )}
            </>
          ) : (
            <>
              {/* Fallback: plain text input */}
              <Input
                id="address"
                value={address}
                onChange={(event) => onAddressChange(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && address.trim()) onSubmit()
                }}
                placeholder="123 Main St, Austin, TX 78701"
                className="h-12 text-base"
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
