"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Eye,
  Edit,
  BarChart3,
  Users,
  CalendarCheck,
  FileText,
  Plus,
  ExternalLink,
  Settings,
} from "lucide-react"
import Link from "next/link"

interface WebsiteData {
  id: string
  templateId: string
  published: boolean
  subdomain: string | null
  customDomain: string | null
  companyTagline: string | null
  lastPublished: string | null
  lastEdited: string | null
  pages: PageData[]
}

interface PageData {
  id: string
  slug: string
  pageType: string
  title: string
  published: boolean
  updatedAt: string
}

interface WebsiteDashboardProps {
  website: WebsiteData | null
}

const PAGE_TYPE_LABELS: Record<string, string> = {
  HOME: "Homepage",
  SERVICE: "Service",
  SUB_SERVICE: "Sub-Service",
  SERVICE_AREA: "Service Area",
  ABOUT: "About",
  REVIEWS: "Reviews",
  GALLERY: "Gallery",
  BLOG: "Blog",
  BLOG_POST: "Blog Post",
  FAQ: "FAQ",
  FINANCING: "Financing",
  CONTACT: "Contact",
  CUSTOM: "Custom",
}

export function WebsiteDashboard({ website }: WebsiteDashboardProps) {
  if (!website) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Globe className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Build Your Professional Website</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Launch a stunning, SEO-optimized website for your roofing company in under 30 minutes.
          No coding or design skills needed.
        </p>
        <Link href="/website-builder/setup">
          <Button size="lg" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-5 w-5 mr-2" /> Get Started
          </Button>
        </Link>
      </div>
    )
  }

  const domain = website.customDomain || (website.subdomain ? `${website.subdomain}.bldrkit.com` : null)

  return (
    <div className="space-y-6">
      {/* Status & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant={website.published ? "default" : "secondary"} className="text-sm">
            {website.published ? "🟢 Published" : "📝 Draft"}
          </Badge>
          {domain && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3" /> {domain}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" /> Preview
          </Button>
          <Link href="/website-builder/setup">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" /> Settings
            </Button>
          </Link>
          <Button size="sm" className={website.published ? "" : "bg-green-600 hover:bg-green-700"}>
            {website.published ? (
              <>
                <ExternalLink className="h-4 w-4 mr-1" /> View Live Site
              </>
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">—</p>
                <p className="text-xs text-muted-foreground">Monthly Visits</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">—</p>
                <p className="text-xs text-muted-foreground">Leads Generated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <CalendarCheck className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">—</p>
                <p className="text-xs text-muted-foreground">Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pages List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" /> Website Pages
              </CardTitle>
              <CardDescription>{website.pages.length} pages</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {website.pages.map((page) => (
              <Link
                key={page.id}
                href={`/website-builder/pages/${page.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {PAGE_TYPE_LABELS[page.pageType] || page.pageType}
                  </Badge>
                  <span className="font-medium text-sm">{page.title}</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">{page.slug}</span>
                </div>
                <div className="flex items-center gap-2">
                  {!page.published && (
                    <Badge variant="secondary" className="text-xs">
                      Draft
                    </Badge>
                  )}
                  <Edit className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
