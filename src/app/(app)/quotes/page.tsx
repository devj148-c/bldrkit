"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { AddressInput } from "@/components/quotes/AddressInput";
import { RoofEstimate } from "@/components/quotes/RoofEstimate";
import { PriceCalculator } from "@/components/quotes/PriceCalculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator, Loader2, CheckCircle } from "lucide-react";

export default function QuotesPage() {
  const [address, setAddress] = useState("");
  const [roofArea, setRoofArea] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState("asphalt");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Lead capture form
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");

  async function handleEstimate() {
    if (!address.trim()) return;
    setLoading(true);
    setSubmitted(false);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          materialType: selectedMaterial,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setRoofArea(data.roofAreaSqFt);
        setConfidence(data.estimate?.confidence || "medium");
        setReasoning(data.estimate?.reasoning || null);
      }
    } catch {
      // Error handled by showing empty state
    } finally {
      setLoading(false);
    }
  }

  async function handleCaptureLead() {
    if (!leadName || !leadEmail) return;
    setLoading(true);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          materialType: selectedMaterial,
          leadName,
          leadEmail,
          leadPhone,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setLeadName("");
        setLeadEmail("");
        setLeadPhone("");
      }
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col">
      <Header title="Quote Tool" />
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500 p-2 text-white">
            <Calculator size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Instant Price Quote</h2>
            <p className="text-sm text-gray-500">
              Enter an address to get an AI-powered roof estimate and pricing
            </p>
          </div>
        </div>

        {/* Address Input + Estimate Button */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <AddressInput value={address} onChange={setAddress} />
          </div>
          <Button
            onClick={handleEstimate}
            disabled={loading || !address.trim()}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            {loading ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : (
              <Calculator size={16} className="mr-2" />
            )}
            Get Estimate
          </Button>
        </div>

        {/* Results */}
        <RoofEstimate
          roofArea={roofArea}
          confidence={confidence}
          reasoning={reasoning}
        />

        {roofArea && (
          <>
            <PriceCalculator
              roofArea={roofArea}
              selectedMaterial={selectedMaterial}
              onSelectMaterial={setSelectedMaterial}
            />

            <Separator />

            {/* Lead Capture */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {submitted ? "Quote Sent!" : "Send This Quote to a Customer"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="flex items-center gap-3 text-emerald-600">
                    <CheckCircle size={24} />
                    <div>
                      <p className="font-medium">Lead captured successfully!</p>
                      <p className="text-sm text-gray-500">
                        A new lead has been created in your CRM.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <Label>Name *</Label>
                        <Input
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="Customer name"
                        />
                      </div>
                      <div>
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={leadEmail}
                          onChange={(e) => setLeadEmail(e.target.value)}
                          placeholder="email@example.com"
                        />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          placeholder="(555) 000-0000"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleCaptureLead}
                      disabled={loading || !leadName || !leadEmail}
                      className="bg-emerald-500 hover:bg-emerald-600"
                    >
                      Capture Lead & Save Quote
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
