import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { EstimateBuilder } from "@/components/estimates/EstimateBuilder"

export default async function EstimateDetailPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ customerId?: string; jobId?: string }>
}) {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const { id } = await params
  const search = await searchParams

  const customers = await prisma.customer.findMany({
    where: { organizationId: session.orgId },
    orderBy: { firstName: "asc" },
  })

  if (id === "new") {
    return (
      <>
        <Header title="New Estimate" subtitle="Create a new estimate" />
        <div className="p-6">
          <EstimateBuilder
            customers={JSON.parse(JSON.stringify(customers))}
            defaultCustomerId={search.customerId}
            defaultJobId={search.jobId}
          />
        </div>
      </>
    )
  }

  const estimate = await prisma.estimate.findFirst({
    where: { id, organizationId: session.orgId },
    include: { customer: true, job: true },
  })

  if (!estimate) notFound()

  return (
    <>
      <Header
        title={`Estimate #${estimate.estimateNumber}`}
        subtitle={`${estimate.customer.firstName} ${estimate.customer.lastName}`}
      />
      <div className="p-6">
        <EstimateBuilder
          estimate={JSON.parse(JSON.stringify(estimate))}
          customers={JSON.parse(JSON.stringify(customers))}
        />
      </div>
    </>
  )
}
