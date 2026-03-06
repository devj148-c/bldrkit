import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Phone, Mail, MapPin, Briefcase, FileText, Receipt } from "lucide-react"
import Link from "next/link"

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const { id } = await params

  // Handle "new" customer
  if (id === "new") {
    return <NewCustomerPage orgId={session.orgId} />
  }

  const customer = await prisma.customer.findFirst({
    where: { id, organizationId: session.orgId },
    include: {
      jobs: { orderBy: { createdAt: "desc" }, take: 10 },
      estimates: { orderBy: { createdAt: "desc" }, take: 5 },
      invoices: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  })

  if (!customer) notFound()

  return (
    <>
      <Header
        title={`${customer.firstName} ${customer.lastName}`}
        subtitle="Customer details"
      />
      <div className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${customer.email}`} className="hover:text-primary">{customer.email}</a>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${customer.phone}`} className="hover:text-primary">{customer.phone}</a>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{customer.address}</p>
                    {customer.city && <p>{customer.city}, {customer.state} {customer.zip}</p>}
                  </div>
                </div>
              )}
              {customer.source && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">Source</p>
                  <Badge variant="secondary">{customer.source}</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Jobs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Jobs ({customer.jobs.length})
              </CardTitle>
              <Link href={`/jobs?customerId=${customer.id}`}>
                <Button size="sm" variant="ghost">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {customer.jobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No jobs yet</p>
              ) : (
                <div className="space-y-2">
                  {customer.jobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="block p-2 rounded-md hover:bg-accent transition-colors"
                    >
                      <p className="text-sm font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.status.replace("_", " ")} · {formatDate(job.createdAt)}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financials */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Receipt className="h-4 w-4" /> Financials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="h-3 w-3" /> Estimates ({customer.estimates.length})
                </p>
                {customer.estimates.slice(0, 3).map((est) => (
                  <Link key={est.id} href={`/estimates/${est.id}`} className="block text-sm py-1 hover:text-primary">
                    #{est.estimateNumber} — {formatCurrency(Number(est.total))}
                  </Link>
                ))}
              </div>
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Receipt className="h-3 w-3" /> Invoices ({customer.invoices.length})
                </p>
                {customer.invoices.slice(0, 3).map((inv) => (
                  <Link key={inv.id} href={`/invoices/${inv.id}`} className="block text-sm py-1 hover:text-primary">
                    #{inv.invoiceNumber} — {formatCurrency(Number(inv.total))} ({inv.status})
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        {customer.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}

function NewCustomerPage({ orgId }: { orgId: string }) {
  return (
    <>
      <Header title="New Customer" subtitle="Add a customer to your CRM" />
      <div className="p-6">
        <CustomerForm orgId={orgId} />
      </div>
    </>
  )
}

import { CustomerForm } from "@/components/customers/CustomerForm"
