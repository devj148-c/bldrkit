import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table"

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-500/20 text-gray-400",
  SENT: "bg-blue-500/20 text-blue-400",
  VIEWED: "bg-yellow-500/20 text-yellow-400",
  PARTIAL: "bg-orange-500/20 text-orange-400",
  PAID: "bg-green-500/20 text-green-400",
  OVERDUE: "bg-red-500/20 text-red-400",
  VOID: "bg-gray-400/20 text-gray-500",
}

export default async function InvoicesPage() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const invoices = await prisma.invoice.findMany({
    where: { organizationId: session.orgId },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  })

  const totalOutstanding = invoices
    .filter((inv) => ["SENT", "VIEWED", "PARTIAL", "OVERDUE"].includes(inv.status))
    .reduce((sum, inv) => sum + Number(inv.total) - Number(inv.amountPaid), 0)

  return (
    <>
      <Header
        title="Invoices"
        subtitle={`${invoices.length} total · ${formatCurrency(totalOutstanding)} outstanding`}
        actions={
          <Link href="/invoices/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> New Invoice
            </Button>
          </Link>
        }
      />
      <div className="p-6">
        {invoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No invoices yet. Create your first!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <Link href={`/invoices/${inv.id}`} className="font-medium hover:text-primary">
                      #{inv.invoiceNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{inv.customer.firstName} {inv.customer.lastName}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_STYLES[inv.status]}>{inv.status}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(Number(inv.total))}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {inv.dueDate ? formatDate(inv.dueDate) : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}
