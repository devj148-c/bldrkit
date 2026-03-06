import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { CalendarView } from "@/components/schedule/CalendarView"

export default async function SchedulePage() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const jobs = await prisma.job.findMany({
    where: {
      organizationId: session.orgId,
      scheduledStart: { not: null },
    },
    include: { customer: true },
    orderBy: { scheduledStart: "asc" },
  })

  return (
    <>
      <Header title="Schedule" subtitle="Calendar view of scheduled jobs" />
      <div className="p-6">
        <CalendarView jobs={JSON.parse(JSON.stringify(jobs))} />
      </div>
    </>
  )
}
