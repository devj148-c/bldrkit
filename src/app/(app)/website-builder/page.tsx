"use client"

import { Header } from "@/components/layout/Header"
import { WebsiteDashboard } from "@/components/website-builder/WebsiteDashboard"
import { useEffect, useState } from "react"

interface WebsiteData {
  id: string
  templateId: string
  published: boolean
  subdomain: string | null
  customDomain: string | null
  companyTagline: string | null
  lastPublished: string | null
  lastEdited: string | null
  pages: Array<{
    id: string
    slug: string
    pageType: string
    title: string
    published: boolean
    updatedAt: string
  }>
}

export default function WebsiteBuilderPage() {
  const [website, setWebsite] = useState<WebsiteData | null | undefined>(undefined)

  useEffect(() => {
    // Try to load website data from localStorage (since no DB connected)
    const stored = localStorage.getItem("bldrkit-website")
    if (stored) {
      try {
        setWebsite(JSON.parse(stored))
      } catch {
        setWebsite(null)
      }
    } else {
      setWebsite(null)
    }
  }, [])

  if (website === undefined) {
    return (
      <>
        <Header title="Website Builder" />
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header
        title="Website Builder"
        subtitle={website ? "Manage your website" : "Create your first website"}
      />
      <div className="p-6">
        <WebsiteDashboard website={website} />
      </div>
    </>
  )
}
