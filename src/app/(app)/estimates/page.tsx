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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-gray-500/20 text-gray-400",
  SENT: "bg-blue-500/20 text-blue-400",
  VIEWED: "bg-yellow-500/20 text-yellow-400",
  ACCEPTED: "bg-green-500/20 text-green-400",
  DECLINED: "bg-red-500/20 text-red-400",
  EXPIRED: "bg-gray-400/20 text-gray-500",
}

export default async function EstimatesPage() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const estimates = await prisma.estimate.findMany({
    where: { organizationId: session.orgId },
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <>
      <Header
        title="Estimates"
        subtitle={`${estimates.length} total estimates`}
        actions={
          <Link href="/estimates/new">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" /> New Estimate
            </Button>
          </Link>
        }
      />
      <div className="p-6">
        {estimates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No estimates yet. Create your first!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Estimate #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {estimates.map((est) => (
                <TableRow key={est.id}>
                  <TableCell>
                    <Link href={`/estimates/${est.id}`} className="font-medium hover:text-primary">
                      #{est.estimateNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{est.customer.firstName} {est.customer.lastName}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_STYLES[est.status]}>{est.status}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(Number(est.total))}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(est.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  )
}
