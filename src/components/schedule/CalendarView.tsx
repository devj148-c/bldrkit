"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns"
import Link from "next/link"

interface ScheduledJob {
  id: string
  title: string
  status: string
  scheduledStart: string
  scheduledEnd: string | null
  customer: { firstName: string; lastName: string }
}

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: "bg-yellow-500",
  IN_PROGRESS: "bg-orange-500",
  COMPLETED: "bg-green-500",
  LEAD: "bg-gray-500",
  QUOTED: "bg-blue-500",
}

export function CalendarView({ jobs }: { jobs: ScheduledJob[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [view, setView] = useState<"month" | "week">("month")

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calStart = startOfWeek(monthStart)
  const calEnd = endOfWeek(monthEnd)

  const days = useMemo(() => {
    const result: Date[] = []
    let day = calStart
    while (day <= calEnd) {
      result.push(day)
      day = addDays(day, 1)
    }
    return result
  }, [calStart, calEnd])

  function getJobsForDay(date: Date) {
    return jobs.filter((job) => {
      const jobDate = new Date(job.scheduledStart)
      return isSameDay(jobDate, date)
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-1">
            <Button size="icon" variant="outline" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setCurrentMonth(new Date())}>
              Today
            </Button>
            <Button size="icon" variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant={view === "month" ? "default" : "outline"} onClick={() => setView("month")}>
            Month
          </Button>
          <Button size="sm" variant={view === "week" ? "default" : "outline"} onClick={() => setView("week")}>
            Week
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const dayJobs = getJobsForDay(day)
              const inMonth = isSameMonth(day, currentMonth)
              const today = isToday(day)

              return (
                <div
                  key={i}
                  className={`min-h-[100px] border-b border-r p-1 ${
                    !inMonth ? "bg-muted/30" : ""
                  }`}
                >
                  <div className={`text-xs font-medium p-1 ${
                    today
                      ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                      : inMonth ? "" : "text-muted-foreground"
                  }`}>
                    {format(day, "d")}
                  </div>
                  <div className="space-y-0.5 mt-1">
                    {dayJobs.slice(0, 3).map((job) => (
                      <Link key={job.id} href={`/jobs/${job.id}`}>
                        <div className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px] hover:bg-accent truncate">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_COLORS[job.status] || "bg-gray-500"}`} />
                          <span className="truncate">{job.title}</span>
                        </div>
                      </Link>
                    ))}
                    {dayJobs.length > 3 && (
                      <div className="text-[10px] text-muted-foreground px-1">
                        +{dayJobs.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
