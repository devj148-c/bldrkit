"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calculator,
  FileText,
  Send,
  Copy,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Common roofing materials with typical cost ranges (per square = 100 sq ft)
const MATERIAL_PRESETS = {
  "3-Tab Asphalt Shingles": { materialPerSq: 90, laborPerSq: 150, wasteFactor: 1.10 },
  "Architectural Shingles": { materialPerSq: 130, laborPerSq: 175, wasteFactor: 1.10 },
  "Premium Designer Shingles": { materialPerSq: 200, laborPerSq: 200, wasteFactor: 1.12 },
  "Standing Seam Metal": { materialPerSq: 350, laborPerSq: 300, wasteFactor: 1.05 },
  "Metal Shingles": { materialPerSq: 280, laborPerSq: 250, wasteFactor: 1.08 },
  "TPO Flat Roof": { materialPerSq: 180, laborPerSq: 200, wasteFactor: 1.05 },
  "EPDM Flat Roof": { materialPerSq: 150, laborPerSq: 180, wasteFactor: 1.05 },
  "Clay Tile": { materialPerSq: 400, laborPerSq: 350, wasteFactor: 1.12 },
  "Concrete Tile": { materialPerSq: 250, laborPerSq: 300, wasteFactor: 1.10 },
  "Cedar Shake": { materialPerSq: 350, laborPerSq: 300, wasteFactor: 1.15 },
  "Synthetic Slate": { materialPerSq: 300, laborPerSq: 250, wasteFactor: 1.08 },
  "Natural Slate": { materialPerSq: 600, laborPerSq: 400, wasteFactor: 1.10 },
}

const ADDITIONAL_LINE_ITEMS = [
  { name: "Tear-off & Disposal (per layer)", unit: "per sq", defaultCost: 75 },
  { name: "Drip Edge (linear ft)", unit: "per lf", defaultCost: 3.50 },
  { name: "Ice & Water Shield", unit: "per sq", defaultCost: 65 },
  { name: "Synthetic Underlayment", unit: "per sq", defaultCost: 45 },
  { name: "Ridge Cap Shingles", unit: "per lf", defaultCost: 5.50 },
  { name: "Ridge Vent", unit: "per lf", defaultCost: 8 },
  { name: "Pipe Boots / Flashing", unit: "each", defaultCost: 25 },
  { name: "Chimney Flashing", unit: "each", defaultCost: 350 },
  { name: "Skylight Flashing", unit: "each", defaultCost: 250 },
  { name: "Plywood Replacement", unit: "per sheet", defaultCost: 75 },
  { name: "Fascia Board Repair", unit: "per lf", defaultCost: 12 },
  { name: "Gutter Re-hang", unit: "per lf", defaultCost: 6 },
  { name: "Permit Fee", unit: "flat", defaultCost: 250 },
  { name: "Dumpster Rental", unit: "flat", defaultCost: 450 },
]

interface LineItem {
  name: string
  quantity: number
  unitCost: number
  total: number
}

export function QuickEstimateCalculator() {
  const [material, setMaterial] = useState<string>("Architectural Shingles")
  const [roofSqFt, setRoofSqFt] = useState<string>("2000")
  const [stories, setStories] = useState<string>("1")
  const [tearOffLayers, setTearOffLayers] = useState<string>("1")
  const [margin, setMargin] = useState<string>("25")
  const [lineItems, setLineItems] = useState<LineItem[]>([])
  const [showAddItems, setShowAddItems] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [copied, setCopied] = useState(false)

  const preset = MATERIAL_PRESETS[material as keyof typeof MATERIAL_PRESETS]
  const sqFt = parseFloat(roofSqFt) || 0
  const squares = sqFt / 100
  const storyMultiplier = parseFloat(stories) === 2 ? 1.15 : parseFloat(stories) >= 3 ? 1.30 : 1.0
  const marginPct = (parseFloat(margin) || 0) / 100

  // Core costs
  const materialCost = squares * preset.materialPerSq * preset.wasteFactor
  const laborCost = squares * preset.laborPerSq * storyMultiplier
  const tearOffCost = squares * 75 * (parseFloat(tearOffLayers) || 0)

  // Standard items (always included)
  const underlayment = squares * 45
  const ridgeCap = Math.sqrt(sqFt) * 5.5 // rough estimate of ridge length
  const dripEdge = Math.sqrt(sqFt) * 4 * 3.5 // perimeter estimate

  // Additional line items
  const additionalTotal = lineItems.reduce((sum, item) => sum + item.total, 0)

  const subtotal = materialCost + laborCost + tearOffCost + underlayment + ridgeCap + dripEdge + additionalTotal
  const marginAmount = subtotal * marginPct
  const total = subtotal + marginAmount

  function addLineItem(item: typeof ADDITIONAL_LINE_ITEMS[0]) {
    setLineItems(prev => [
      ...prev,
      { name: item.name, quantity: 1, unitCost: item.defaultCost, total: item.defaultCost }
    ])
  }

  function updateLineItem(index: number, field: "quantity" | "unitCost", value: number) {
    setLineItems(prev => prev.map((item, i) => {
      if (i !== index) return item
      const updated = { ...item, [field]: value }
      updated.total = updated.quantity * updated.unitCost
      return updated
    }))
  }

  function removeLineItem(index: number) {
    setLineItems(prev => prev.filter((_, i) => i !== index))
  }

  function copyEstimate() {
    const estimate = `
ROOFING ESTIMATE
${customerName ? `Customer: ${customerName}` : ""}
${customerAddress ? `Address: ${customerAddress}` : ""}
Date: ${new Date().toLocaleDateString()}

Material: ${material}
Roof Size: ${sqFt.toLocaleString()} sq ft (${squares.toFixed(1)} squares)
Stories: ${stories}

--- BREAKDOWN ---
Materials: $${materialCost.toFixed(2)}
Labor: $${laborCost.toFixed(2)}
Tear-off (${tearOffLayers} layer${parseFloat(tearOffLayers) > 1 ? 's' : ''}): $${tearOffCost.toFixed(2)}
Underlayment: $${underlayment.toFixed(2)}
Ridge Cap: $${ridgeCap.toFixed(2)}
Drip Edge: $${dripEdge.toFixed(2)}
${lineItems.map(item => `${item.name}: $${item.total.toFixed(2)}`).join('\n')}

Subtotal: $${subtotal.toFixed(2)}
Margin (${margin}%): $${marginAmount.toFixed(2)}

TOTAL: $${total.toFixed(2)}
Price per sq ft: $${(total / sqFt).toFixed(2)}
    `.trim()

    navigator.clipboard.writeText(estimate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-3 space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Customer Info (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input id="customerName" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="John Smith" />
                </div>
                <div>
                  <Label htmlFor="customerAddress">Address</Label>
                  <Input id="customerAddress" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} placeholder="123 Main St, Dallas, TX" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Roof Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Roof Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="material">Roofing Material</Label>
                <select
                  id="material"
                  value={material}
                  onChange={e => setMaterial(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {Object.keys(MATERIAL_PRESETS).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="sqft">Roof Size (sq ft)</Label>
                  <Input id="sqft" type="number" value={roofSqFt} onChange={e => setRoofSqFt(e.target.value)} placeholder="2000" />
                  <p className="text-xs text-muted-foreground mt-1">{squares.toFixed(1)} squares</p>
                </div>
                <div>
                  <Label htmlFor="stories">Stories</Label>
                  <select
                    id="stories"
                    value={stories}
                    onChange={e => setStories(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="1">1 Story</option>
                    <option value="2">2 Stories (+15% labor)</option>
                    <option value="3">3+ Stories (+30% labor)</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="tearoff">Tear-off Layers</Label>
                  <select
                    id="tearoff"
                    value={tearOffLayers}
                    onChange={e => setTearOffLayers(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="0">None (overlay)</option>
                    <option value="1">1 Layer</option>
                    <option value="2">2 Layers</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="margin">Profit Margin (%)</Label>
                <Input id="margin" type="number" value={margin} onChange={e => setMargin(e.target.value)} placeholder="25" className="max-w-32" />
              </div>
            </CardContent>
          </Card>

          {/* Additional Line Items */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Additional Items</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowAddItems(!showAddItems)}>
                  {showAddItems ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showAddItems ? "Hide" : "Add Items"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {showAddItems && (
                <div className="grid sm:grid-cols-2 gap-2 pb-4 border-b">
                  {ADDITIONAL_LINE_ITEMS.map(item => (
                    <Button
                      key={item.name}
                      variant="outline"
                      size="sm"
                      className="justify-start text-xs h-8"
                      onClick={() => addLineItem(item)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {item.name}
                    </Button>
                  ))}
                </div>
              )}

              {lineItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">No additional items. Click &quot;Add Items&quot; to include extras.</p>
              ) : (
                <div className="space-y-2">
                  {lineItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="flex-1 truncate">{item.name}</span>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={e => updateLineItem(index, "quantity", parseFloat(e.target.value) || 0)}
                        className="w-16 h-8 text-xs"
                      />
                      <span className="text-muted-foreground">×</span>
                      <Input
                        type="number"
                        value={item.unitCost}
                        onChange={e => updateLineItem(index, "unitCost", parseFloat(e.target.value) || 0)}
                        className="w-20 h-8 text-xs"
                        step="0.01"
                      />
                      <span className="w-20 text-right font-medium">${item.total.toFixed(0)}</span>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => removeLineItem(index)}>
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estimate Summary Panel */}
        <div className="lg:col-span-2">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Estimate Summary
              </CardTitle>
              <CardDescription>
                {material} • {sqFt.toLocaleString()} sq ft
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Materials</span>
                  <span>${materialCost.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Labor{parseFloat(stories) > 1 ? ` (${stories}-story)` : ""}</span>
                  <span>${laborCost.toFixed(0)}</span>
                </div>
                {parseFloat(tearOffLayers) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tear-off ({tearOffLayers} layer{parseFloat(tearOffLayers) > 1 ? "s" : ""})</span>
                    <span>${tearOffCost.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Underlayment</span>
                  <span>${underlayment.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ridge Cap</span>
                  <span>${ridgeCap.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Drip Edge</span>
                  <span>${dripEdge.toFixed(0)}</span>
                </div>

                {lineItems.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-muted-foreground truncate mr-2">{item.name}</span>
                    <span>${item.total.toFixed(0)}</span>
                  </div>
                ))}

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-primary">
                    <span>Margin ({margin}%)</span>
                    <span>+${marginAmount.toFixed(0)}</span>
                  </div>
                </div>

                <div className="border-t pt-3 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Per sq ft</span>
                    <span>${sqFt > 0 ? (total / sqFt).toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Per square</span>
                    <span>${squares > 0 ? (total / squares).toFixed(0) : "0"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button className="w-full" onClick={copyEstimate}>
                  {copied ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Estimate
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <FileText className="mr-2 h-4 w-4" />
                  Save as Estimate
                </Button>
                <Button variant="outline" className="w-full" disabled>
                  <Send className="mr-2 h-4 w-4" />
                  Send to Customer
                </Button>
                <p className="text-xs text-center text-muted-foreground">Save & Send available after database setup</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
