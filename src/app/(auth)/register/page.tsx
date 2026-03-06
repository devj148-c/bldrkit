"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Step 1: Account
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Step 2: Organization
  const [orgName, setOrgName] = useState("")
  const [orgPhone, setOrgPhone] = useState("")

  // Step 3: Trade selection
  const [selectedTrades, setSelectedTrades] = useState<string[]>([])

  const trades = [
    { key: "roofing", label: "Roofing", emoji: "🏠" },
    { key: "hvac", label: "HVAC", emoji: "❄️" },
    { key: "plumbing", label: "Plumbing", emoji: "🔧" },
    { key: "electrical", label: "Electrical", emoji: "⚡" },
    { key: "painting", label: "Painting", emoji: "🎨" },
    { key: "landscaping", label: "Landscaping", emoji: "🌿" },
    { key: "general", label: "General Contracting", emoji: "🔨" },
    { key: "cleaning", label: "Cleaning", emoji: "✨" },
  ]

  function toggleTrade(key: string) {
    setSelectedTrades((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    )
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          orgName,
          orgPhone,
          trades: selectedTrades,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Registration failed")
        setLoading(false)
        return
      }

      // Auto sign in
      const { signIn } = await import("next-auth/react")
      await signIn("credentials", { email, password, redirect: false })
      router.push("/dashboard")
    } catch {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mb-4">
            <span className="text-3xl font-bold text-primary">BLDR</span>
            <span className="text-3xl font-bold">Kit</span>
          </div>
          <CardTitle>
            {step === 1 && "Create your account"}
            {step === 2 && "Set up your company"}
            {step === 3 && "Select your trades"}
          </CardTitle>
          <CardDescription>
            Step {step} of 3
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@smithroofing.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 characters" required />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="orgName">Company Name</Label>
                <Input id="orgName" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Smith Roofing & Siding" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orgPhone">Phone</Label>
                <Input id="orgPhone" type="tel" value={orgPhone} onChange={(e) => setOrgPhone(e.target.value)} placeholder="(555) 123-4567" />
              </div>
            </>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-3">
              {trades.map((trade) => (
                <button
                  key={trade.key}
                  type="button"
                  onClick={() => toggleTrade(trade.key)}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                    selectedTrades.includes(trade.key)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <span className="text-2xl">{trade.emoji}</span>
                  <span className="text-sm font-medium">{trade.label}</span>
                </button>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="flex gap-3 w-full">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="flex-1"
                disabled={
                  (step === 1 && (!name || !email || !password)) ||
                  (step === 2 && !orgName)
                }
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={loading || selectedTrades.length === 0}
              >
                {loading ? "Creating..." : "Get Started"}
              </Button>
            )}
          </div>
          {step === 1 && (
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
