import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { PLANS } from "@/lib/stripe"

export default async function BillingPage() {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const org = await prisma.organization.findUnique({
    where: { id: session.orgId },
  })

  if (!org) redirect("/login")

  return (
    <>
      <Header title="Billing" subtitle="Manage your subscription" />
      <div className="p-6 max-w-5xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Badge className="text-lg px-3 py-1">{org.plan}</Badge>
              <span className="text-muted-foreground">
                {PLANS[org.plan as keyof typeof PLANS]?.name || org.plan}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-4">
          {Object.entries(PLANS).map(([key, plan]) => (
            <Card
              key={key}
              className={key === org.plan ? "border-primary" : ""}
            >
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="text-2xl font-bold">
                  ${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={key === org.plan ? "outline" : "default"}
                  className="w-full"
                  disabled={key === org.plan}
                >
                  {key === org.plan ? "Current Plan" : "Upgrade"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
