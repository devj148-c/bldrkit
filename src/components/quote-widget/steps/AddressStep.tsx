"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

interface AddressStepProps {
  address: string
  onAddressChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export function AddressStep({ address, onAddressChange, onSubmit, disabled }: AddressStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null)
  const [apiLoaded, setApiLoaded] = useState(false)

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    if (!apiKey) return

    // Check if already loaded
    if (window.google?.maps?.places) {
      setApiLoaded(true)
      return
    }

    // Load Google Maps script
    const existing = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existing) {
      existing.addEventListener("load", () => setApiLoaded(true))
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    script.onload = () => setApiLoaded(true)
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!apiLoaded || !inputRef.current || autocompleteRef.current) return

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "us" },
      fields: ["formatted_address", "geometry", "address_components"],
    })

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (place?.formatted_address) {
        onAddressChange(place.formatted_address)
      }
    })

    autocompleteRef.current = autocomplete
  }, [apiLoaded, onAddressChange])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Don't submit if autocomplete dropdown is open
      const pacContainer = document.querySelector(".pac-container")
      if (pacContainer && pacContainer.querySelector(".pac-item-selected")) {
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
          <Input
            ref={inputRef}
            id="address"
            value={address}
            onChange={(event) => onAddressChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start typing your address..."
            className="h-12 text-base"
            autoComplete="off"
          />
          {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY && (
            <p className="text-xs text-muted-foreground">
              Enter your full street address including city and state
            </p>
          )}
        </div>
        <Button 
          className="w-full h-12 text-base font-semibold" 
          onClick={onSubmit} 
          disabled={disabled || !address.trim()}
        >
          Measure My Roof →
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Free estimate · No obligation · Takes 60 seconds
        </p>
      </CardContent>
    </Card>
  )
}
