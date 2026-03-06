import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  DollarSign,
  Briefcase,
  Users,
  FileText,
  Receipt,
  TrendingUp,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const orgId = session.orgId

  // Parallel data fetching
  const [
    customerCount,
    jobCounts,
    recentJobs,
    overdueInvoices,
    estimateCount,
    invoiceTotal,
  ] = await Promise.all([
    prisma.customer.count({ where: { organizationId: orgId } }),
    prisma.job.groupBy({
      by: ["status"],
      where: { organizationId: orgId },
      _count: true,
    }),
    prisma.job.findMany({
      where: { organizationId: orgId },
      include: { customer: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.invoice.findMany({
      where: {
        organizationId: orgId,
        status: { in: ["SENT", "OVERDUE"] },
        dueDate: { lt: new Date() },
      },
      include: { customer: true },
      take: 5,
    }),
    prisma.estimate.count({
      where: { organizationId: orgId, status: "SENT" },
    }),
    prisma.invoice.aggregate({
      where: { organizationId: orgId, status: "PAID" },
      _sum: { total: true },
    }),
  ])

  const totalJobs = jobCounts.reduce((acc, c) => acc + c._count, 0)
  const activeJobs = jobCounts.filter((c) => ["IN_PROGRESS", "SCHEDULED"].includes(c.status)).reduce((acc, c) => acc + c._count, 0)
  const totalRevenue = invoiceTotal._sum.total ? Number(invoiceTotal._sum.total) : 0

  const statusColors: Record<string, string> = {
    LEAD: "bg-gray-500",
    QUOTED: "bg-blue-500",
    SCHEDULED: "bg-yellow-500",
    IN_PROGRESS: "bg-orange-500",
    COMPLETED: "bg-green-500",
    ON_HOLD: "bg-red-500",
    CANCELLED: "bg-gray-400",
  }

  return (
    <>
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${session.user.name || "there"}!`}
        actions={
          <div className="flex gap-2">
            <Link href="/customers">
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Customer
              </Button>
            </Link>
            <Link href="/jobs">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> Job
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">From paid invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobs}</div>
              <p className="text-xs text-muted-foreground">{totalJobs} total jobs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customerCount}</div>
              <p className="text-xs text-muted-foreground">In your CRM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Estimates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{estimateCount}</div>
              <p className="text-xs text-muted-foreground">Awaiting response</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Recent Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentJobs.length === 0 ? (
                <p className="text-sm text-muted-foreground">No jobs yet. Create your first job!</p>
              ) : (
                <div className="space-y-3">
                  {recentJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="flex items-center justify-between rounded-md p-2 hover:bg-accent transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">{job.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {job.customer.firstName} {job.customer.lastName}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <span className={`w-2 h-2 rounded-full mr-1.5 ${statusColors[job.status]}`} />
                        {job.status.replace("_", " ")}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Overdue Invoices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Outstanding Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overdueInvoices.length === 0 ? (
                <p className="text-sm text-muted-foreground">No outstanding invoices. Nice!</p>
              ) : (
                <div className="space-y-3">
                  {overdueInvoices.map((inv) => (
                    <Link
                      key={inv.id}
                      href={`/invoices/${inv.id}`}
                      className="flex items-center justify-between rounded-md p-2 hover:bg-accent transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium">#{inv.invoiceNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {inv.customer.firstName} {inv.customer.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-destructive">
                          {formatCurrency(Number(inv.total))}
                        </p>
                        {inv.dueDate && (
                          <p className="text-xs text-muted-foreground">
                            Due {formatDate(inv.dueDate)}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pipeline Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Job Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {["LEAD", "QUOTED", "SCHEDULED", "IN_PROGRESS", "COMPLETED"].map((status) => {
                const count = jobCounts.find((c) => c.status === status)?._count || 0
                return (
                  <div key={status} className="flex-1 min-w-[120px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
                      <span className="text-xs font-medium text-muted-foreground">
                        {status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">{count}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
