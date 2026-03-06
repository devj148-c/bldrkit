"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { v4 as uuid } from "uuid"

interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Customer {
  id: string
  firstName: string
  lastName: string
}

interface InvoiceData {
  id: string
  invoiceNumber: string
  status: string
  customerId: string
  lineItems: LineItem[]
  subtotal: string
  tax: string | null
  total: string
  amountPaid: string
  dueDate: string | null
}

export function InvoiceBuilder({
  invoice,
  customers,
  defaultCustomerId,
  defaultJobId,
}: {
  invoice?: InvoiceData
  customers: Customer[]
  defaultCustomerId?: string
  defaultJobId?: string
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [customerId, setCustomerId] = useState(invoice?.customerId || defaultCustomerId || "")
  const [dueDate, setDueDate] = useState(invoice?.dueDate?.split("T")[0] || "")
  const [taxRate, setTaxRate] = useState(0)
  const [lineItems, setLineItems] = useState<LineItem[]>(
    invoice?.lineItems?.length
      ? invoice.lineItems
      : [{ id: uuid(), description: "", quantity: 1, unitPrice: 0, total: 0 }]
  )

  function addLineItem() {
    setLineItems((prev) => [
      ...prev,
      { id: uuid(), description: "", quantity: 1, unitPrice: 0, total: 0 },
    ])
  }

  function removeLineItem(id: string) {
    setLineItems((prev) => prev.filter((item) => item.id !== id))
  }

  function updateLineItem(id: string, field: string, value: string | number) {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const updated = { ...item, [field]: value }
        if (field === "quantity" || field === "unitPrice") {
          updated.total = Number(updated.quantity) * Number(updated.unitPrice)
        }
        return updated
      })
    )
  }

  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = subtotal * (taxRate / 100)
  const total = subtotal + taxAmount

  async function handleSave() {
    if (!customerId || lineItems.length === 0) return
    setSaving(true)
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          jobId: defaultJobId || null,
          lineItems: lineItems.filter((li) => li.description),
          tax: taxAmount,
          dueDate: dueDate || null,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        router.push(`/invoices/${data.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      {invoice && (
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">{invoice.status}</Badge>
          {invoice.amountPaid && Number(invoice.amountPaid) > 0 && (
            <span className="text-sm text-muted-foreground">
              Paid: {formatCurrency(Number(invoice.amountPaid))}
            </span>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Customer</Label>
            <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)} required>
              <option value="">Select customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button size="sm" variant="outline" onClick={addLineItem}>
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-3 text-xs text-muted-foreground font-medium">
              <span>Description</span>
              <span>Qty</span>
              <span>Unit Price</span>
              <span>Total</span>
              <span></span>
            </div>
            {lineItems.map((item) => (
              <div key={item.id} className="grid grid-cols-[1fr_80px_100px_100px_40px] gap-3 items-center">
                <Input
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  placeholder="Service description..."
                />
                <Input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                />
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={item.unitPrice}
                  onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                />
                <div className="text-sm font-medium">{formatCurrency(item.total)}</div>
                <button
                  onClick={() => removeLineItem(item.id)}
                  className="p-1 rounded hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4 space-y-2 max-w-xs ml-auto">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm gap-2">
              <span className="text-muted-foreground">Tax</span>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="w-16 h-7 text-xs"
                />
                <span className="text-xs">%</span>
                <span className="ml-2">{formatCurrency(taxAmount)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={saving || !customerId}>
          <Save className="h-4 w-4 mr-1" />
          {saving ? "Saving..." : invoice ? "Update Invoice" : "Create Invoice"}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </div>
  )
}
