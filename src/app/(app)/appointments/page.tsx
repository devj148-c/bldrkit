"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { AppointmentList } from "@/components/appointments/AppointmentList"

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

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/appointments")
      .then((r) => {
        if (r.ok) return r.json()
        return []
      })
      .then((data) => {
        setAppointments(Array.isArray(data) ? data : [])
      })
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Header
        title="Appointments"
        subtitle={loading ? "Loading..." : `${appointments.length} total appointments`}
      />
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <p className="text-muted-foreground">Loading appointments...</p>
          </div>
        ) : (
          <AppointmentList initialAppointments={appointments} />
        )}
      </div>
    </>
  )
}
