import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { getSessionWithOrg } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Header } from "@/components/layout/Header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"

interface LeadDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const session = await getSessionWithOrg()
  if (!session?.orgId) redirect("/login")

  const { id } = await params

  const lead = await prisma.lead.findFirst({
    where: { id, organizationId: session.orgId },
    include: { photos: true },
  })

  if (!lead) notFound()

  const mapQuery = lead.lat && lead.lng ? `${lead.lat},${lead.lng}` : encodeURIComponent(lead.address)

  return (
    <>
      <Header
        title={lead.name}
        subtitle="Lead details"
        actions={<Link href="/dashboard/leads" className="text-sm text-muted-foreground hover:underline">Back to leads</Link>}
      />
      <div className="p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Name:</span> {lead.name}</p>
              <p><span className="text-muted-foreground">Phone:</span> {lead.phone}</p>
              <p><span className="text-muted-foreground">Email:</span> {lead.email}</p>
              <p><span className="text-muted-foreground">Address:</span> {lead.address}</p>
              <p><span className="text-muted-foreground">Submitted:</span> {formatDate(lead.createdAt)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Roof Data</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Roof size:</span> {lead.roofSqft ? `${Math.round(lead.roofSqft).toLocaleString()} sq ft` : "Unknown"}</p>
              <p><span className="text-muted-foreground">Pitch:</span> {lead.roofPitchRatio || (lead.roofPitch ? `${lead.roofPitch}°` : "Unknown")}</p>
              <p><span className="text-muted-foreground">Segments:</span> {lead.roofSegments ?? "Unknown"}</p>
              <p><span className="text-muted-foreground">Complexity:</span> <span className="capitalize">{lead.roofComplexity || "Unknown"}</span></p>
              <p><span className="text-muted-foreground">Imagery:</span> {lead.imageryDate || "Unknown"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Quote and Status</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Work type:</span> <span className="capitalize">{lead.workType}</span></p>
              <p><span className="text-muted-foreground">Material:</span> <span className="capitalize">{lead.material || "unsure"}</span></p>
              <p>
                <span className="text-muted-foreground">Estimate:</span>{" "}
                {lead.lowEstimate !== null && lead.highEstimate !== null
                  ? `${formatCurrency(lead.lowEstimate)} - ${formatCurrency(lead.highEstimate)}`
                  : "Pending"}
              </p>
              <p><span className="text-muted-foreground">Appointment:</span> {lead.appointmentDate ? formatDate(lead.appointmentDate) : "Not set"}</p>
              <p><span className="text-muted-foreground">Preferred slot:</span> <span className="capitalize">{lead.appointmentSlot || "Not set"}</span></p>
              <div className="pt-1">
                <Badge variant="outline" className="capitalize">{lead.status}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Property Map</CardTitle></CardHeader>
          <CardContent>
            <iframe
              title="Property map"
              src={`https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`}
              className="h-80 w-full rounded-md border"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Photos</CardTitle></CardHeader>
          <CardContent>
            {lead.photos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No photos uploaded.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {lead.photos.map((photo) => (
                  <a key={photo.id} href={photo.url} target="_blank" rel="noreferrer" className="block rounded-md border p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={photo.filename} className="h-28 w-full rounded object-cover" />
                    <p className="mt-2 truncate text-xs">{photo.filename}</p>
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
