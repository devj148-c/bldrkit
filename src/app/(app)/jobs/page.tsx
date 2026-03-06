import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { JobBoard } from "@/components/jobs/JobBoard"

export default async function JobsPage() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const [jobs, customers] = await Promise.all([
    prisma.job.findMany({
      where: { organizationId: session.orgId },
      include: { customer: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.customer.findMany({
      where: { organizationId: session.orgId },
      orderBy: { firstName: "asc" },
    }),
  ])

  return (
    <>
      <Header
        title="Jobs"
        subtitle={`${jobs.length} total jobs`}
      />
      <div className="p-6">
        <JobBoard
          initialJobs={JSON.parse(JSON.stringify(jobs))}
          customers={JSON.parse(JSON.stringify(customers))}
        />
      </div>
    </>
  )
}
