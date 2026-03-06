import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/utils"
import { MapPin, Clock, User, FileText, Receipt } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const STATUS_COLORS: Record<string, string> = {
  LEAD: "bg-gray-500",
  QUOTED: "bg-blue-500",
  SCHEDULED: "bg-yellow-500",
  IN_PROGRESS: "bg-orange-500",
  COMPLETED: "bg-green-500",
  ON_HOLD: "bg-red-500",
  CANCELLED: "bg-gray-400",
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const { id } = await params

  const job = await prisma.job.findFirst({
    where: { id, organizationId: session.orgId },
    include: {
      customer: true,
      estimates: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
      photos: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!job) notFound()

  return (
    <>
      <Header
        title={job.title}
        subtitle={`${job.customer.firstName} ${job.customer.lastName}`}
        actions={
          <div className="flex gap-2">
            <Link href={`/estimates/new?jobId=${job.id}&customerId=${job.customerId}`}>
              <Button size="sm" variant="outline">
                <FileText className="h-4 w-4 mr-1" /> Create Estimate
              </Button>
            </Link>
            <Link href={`/invoices/new?jobId=${job.id}&customerId=${job.customerId}`}>
              <Button size="sm" variant="outline">
                <Receipt className="h-4 w-4 mr-1" /> Create Invoice
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Status & Details */}
          <Card className="md:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Job Details</CardTitle>
                <Badge variant="secondary" className="text-sm">
                  <span className={`w-2 h-2 rounded-full mr-2 ${STATUS_COLORS[job.status]}`} />
                  {job.status.replace("_", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {job.description && (
                <p className="text-sm">{job.description}</p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge variant="outline">{job.priority}</Badge>
                </div>
                {job.moduleKey && (
                  <div>
                    <p className="text-xs text-muted-foreground">Trade</p>
                    <Badge variant="outline">{job.moduleKey}</Badge>
                  </div>
                )}
                {job.estimatedValue && (
                  <div>
                    <p className="text-xs text-muted-foreground">Estimated Value</p>
                    <p className="font-medium">{formatCurrency(Number(job.estimatedValue))}</p>
                  </div>
                )}
                {job.scheduledStart && (
                  <div>
                    <p className="text-xs text-muted-foreground">Scheduled</p>
                    <p className="text-sm flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(job.scheduledStart)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" /> Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/customers/${job.customerId}`} className="text-sm font-medium hover:text-primary">
                {job.customer.firstName} {job.customer.lastName}
              </Link>
              {job.customer.phone && <p className="text-sm">{job.customer.phone}</p>}
              {job.customer.email && <p className="text-sm">{job.customer.email}</p>}

              {(job.jobAddress || job.customer.address) && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <MapPin className="h-3 w-3" /> Job Location
                  </p>
                  <p className="text-sm">
                    {job.jobAddress || job.customer.address}<br />
                    {job.jobCity || job.customer.city}, {job.jobState || job.customer.state} {job.jobZip || job.customer.zip}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Estimates & Invoices */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Estimates ({job.estimates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {job.estimates.length === 0 ? (
                <p className="text-sm text-muted-foreground">No estimates yet</p>
              ) : (
                <div className="space-y-2">
                  {job.estimates.map((est) => (
                    <Link key={est.id} href={`/estimates/${est.id}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                      <div>
                        <p className="text-sm font-medium">#{est.estimateNumber}</p>
                        <p className="text-xs text-muted-foreground">{est.status}</p>
                      </div>
                      <p className="text-sm font-medium">{formatCurrency(Number(est.total))}</p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Invoices ({job.invoices.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {job.invoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No invoices yet</p>
              ) : (
                <div className="space-y-2">
                  {job.invoices.map((inv) => (
                    <Link key={inv.id} href={`/invoices/${inv.id}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-accent">
                      <div>
                        <p className="text-sm font-medium">#{inv.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground">{inv.status}</p>
                      </div>
                      <p className="text-sm font-medium">{formatCurrency(Number(inv.total))}</p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Activity Log ({job.notes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {job.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">No notes yet</p>
            ) : (
              <div className="space-y-3">
                {job.notes.map((note) => (
                  <div key={note.id} className="border-l-2 border-border pl-3 py-1">
                    <p className="text-sm">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(note.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
