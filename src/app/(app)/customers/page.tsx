import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CustomerList } from "@/components/customers/CustomerList"

export default async function CustomersPage() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const customers = await prisma.customer.findMany({
    where: { organizationId: session.orgId },
    include: {
      _count: { select: { jobs: true, invoices: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <>
      <Header
        title="Customers"
        subtitle={`${customers.length} total customers`}
        actions={
          <Link href="/customers/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Customer
            </Button>
          </Link>
        }
      />
      <div className="p-6">
        <CustomerList customers={customers} />
      </div>
    </>
  )
}
