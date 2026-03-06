"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  CalendarCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Appointment {
  id: string
  customerName: string
  customerPhone: string
  customerEmail?: string | null
  customerAddress?: string | null
  serviceRequested: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  notes?: string | null
  status: string
  source?: string | null
  createdAt: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  PENDING: { label: "Pending", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: AlertCircle },
  CONFIRMED: { label: "Confirmed", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: CalendarCheck },
  COMPLETED: { label: "Completed", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
  RESCHEDULED: { label: "Rescheduled", color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: Clock },
  NO_SHOW: { label: "No Show", color: "bg-gray-500/10 text-gray-500 border-gray-500/20", icon: XCircle },
}

interface AppointmentListProps {
  initialAppointments: Appointment[]
}

export function AppointmentList({ initialAppointments }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  const selected = appointments.find((a) => a.id === selectedId)

  const updateStatus = async (id: string, status: string) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        )
      }
    } catch {
      // Handle silently
    } finally {
      setUpdating(false)
    }
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">No Appointments Yet</h3>
          <p className="text-sm text-muted-foreground">
            Appointments booked through your website&apos;s booking widget will appear here.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => {
                const statusCfg = STATUS_CONFIG[appt.status] || STATUS_CONFIG.PENDING
                const StatusIcon = statusCfg.icon
                return (
                  <TableRow
                    key={appt.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedId(appt.id)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{appt.customerName}</p>
                        <p className="text-xs text-muted-foreground">{appt.customerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{appt.serviceRequested}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{new Date(appt.scheduledDate).toLocaleDateString()}</p>
                        <p className="text-xs text-muted-foreground">{appt.scheduledTime}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("text-xs", statusCfg.color)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusCfg.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedId(appt.id)
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelectedId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Customer</p>
                  <p className="font-medium">{selected.customerName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Service</p>
                  <p className="font-medium">{selected.serviceRequested}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${selected.customerPhone}`} className="text-primary">
                    {selected.customerPhone}
                  </a>
                </div>
                {selected.customerEmail && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selected.customerEmail}
                  </div>
                )}
              </div>
              {selected.customerAddress && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {selected.customerAddress}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                {new Date(selected.scheduledDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {selected.scheduledTime}
              </div>
              {selected.notes && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{selected.notes}</p>
                </div>
              )}

              {/* Status Update */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {(["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const).map((status) => {
                    const cfg = STATUS_CONFIG[status]
                    return (
                      <Button
                        key={status}
                        variant={selected.status === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateStatus(selected.id, status)}
                        disabled={updating || selected.status === status}
                      >
                        {cfg.label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
