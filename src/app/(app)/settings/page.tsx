import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Building2, CreditCard, Puzzle, Plug } from "lucide-react"

export default async function SettingsPage() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const org = await prisma.organization.findUnique({
    where: { id: session.orgId },
    include: { modules: true },
  })

  if (!org) redirect("/login")

  return (
    <>
      <Header title="Settings" subtitle="Manage your organization" />
      <div className="p-6 max-w-4xl space-y-6">
        {/* Organization Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Organization
            </CardTitle>
            <CardDescription>Your company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{org.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Slug</p>
                <p className="text-sm text-muted-foreground">{org.slug}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{org.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm">{org.phone || "—"}</p>
              </div>
            </div>
            {(org.address || org.city) && (
              <div>
                <p className="text-xs text-muted-foreground">Address</p>
                <p className="text-sm">
                  {org.address && <>{org.address}<br /></>}
                  {org.city && <>{org.city}, {org.state} {org.zip}</>}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan / Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Billing
            </CardTitle>
            <CardDescription>Your subscription plan</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <Badge variant="secondary" className="text-sm">{org.plan}</Badge>
              <p className="text-sm text-muted-foreground mt-1">
                {org.plan === "FREE" ? "Upgrade to unlock more features" : "Active subscription"}
              </p>
            </div>
            <Link href="/settings/billing">
              <Button variant="outline">Manage Billing</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Puzzle className="h-4 w-4" /> Modules
            </CardTitle>
            <CardDescription>Trade modules enabled for your organization</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {org.modules.length === 0 ? (
                <p className="text-sm text-muted-foreground">No modules enabled</p>
              ) : (
                org.modules.map((m) => (
                  <Badge key={m.moduleKey} variant="outline">{m.moduleKey}</Badge>
                ))
              )}
            </div>
            <Link href="/settings/modules">
              <Button variant="outline">Manage Modules</Button>
            </Link>
          </CardContent>
        </Card>

        {/* Integrations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plug className="h-4 w-4" /> Integrations
            </CardTitle>
            <CardDescription>Connect third-party services</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Integrations (QuickBooks, Zapier, etc.) coming soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
