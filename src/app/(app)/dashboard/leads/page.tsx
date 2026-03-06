import Link from "next/link"
import { redirect } from "next/navigation"
import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/Header"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Inspection Scheduled",
  quoted: "Quoted",
  won: "Won",
  lost: "Lost",
}

export default async function LeadsPage() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const leads = await prisma.lead.findMany({
    where: { organizationId: session.orgId },
    orderBy: { createdAt: "desc" },
    include: { photos: { select: { id: true } } },
  })

  return (
    <>
      <Header title="Leads" subtitle="Smart Quote submissions from your website" />
      <div className="p-6">
        {leads.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            No leads yet. Share your quote page to start collecting pre-qualified leads.
          </div>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Estimate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Link href={`/dashboard/leads/${lead.id}`} className="font-medium hover:underline">
                        {lead.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">{lead.phone}</p>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{lead.address}</TableCell>
                    <TableCell>
                      <p className="text-sm capitalize">{lead.workType}</p>
                      <p className="text-xs text-muted-foreground capitalize">{lead.material || "unsure"}</p>
                    </TableCell>
                    <TableCell>
                      {lead.lowEstimate !== null && lead.highEstimate !== null
                        ? `${formatCurrency(lead.lowEstimate)} - ${formatCurrency(lead.highEstimate)}`
                        : "Pending"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{STATUS_LABELS[lead.status] || lead.status}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">{lead.photos.length} photos</p>
                    </TableCell>
                    <TableCell>{formatDate(lead.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  )
}
