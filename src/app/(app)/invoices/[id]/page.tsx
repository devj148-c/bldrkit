import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { InvoiceBuilder } from "@/components/invoices/InvoiceBuilder"

export default async function InvoiceDetailPage({ params, searchParams }: {
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
        <Header title="New Invoice" subtitle="Create a new invoice" />
        <div className="p-6">
          <InvoiceBuilder
            customers={JSON.parse(JSON.stringify(customers))}
            defaultCustomerId={search.customerId}
            defaultJobId={search.jobId}
          />
        </div>
      </>
    )
  }

  const invoice = await prisma.invoice.findFirst({
    where: { id, organizationId: session.orgId },
    include: { customer: true, job: true },
  })

  if (!invoice) notFound()

  return (
    <>
      <Header
        title={`Invoice #${invoice.invoiceNumber}`}
        subtitle={`${invoice.customer.firstName} ${invoice.customer.lastName}`}
      />
      <div className="p-6">
        <InvoiceBuilder
          invoice={JSON.parse(JSON.stringify(invoice))}
          customers={JSON.parse(JSON.stringify(customers))}
        />
      </div>
    </>
  )
}
