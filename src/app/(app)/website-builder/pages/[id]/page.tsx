"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { PageEditor } from "@/components/website-builder/PageEditor"

interface ContentBlock {
  id: string
  type: "hero" | "text" | "services-grid" | "testimonials" | "cta" | "faq" | "gallery"
  data: Record<string, string | string[]>
}

interface PageData {
  id: string
  slug: string
  pageType: string
  title: string
  metaTitle: string
  metaDescription: string
  h1: string
  content: ContentBlock[]
  published: boolean
}

export default function PageEditorPage() {
  const params = useParams()
  const [page, setPage] = useState<PageData | null>(null)

  useEffect(() => {
    // Load from localStorage
    const stored = localStorage.getItem("bldrkit-website")
    if (stored) {
      try {
        const websiteData = JSON.parse(stored)
        const found = websiteData.pages?.find((p: PageData) => p.id === params.id)
        if (found) {
          // Ensure content is parsed as array of blocks
          const content = Array.isArray(found.content) ? found.content : []
          setPage({ ...found, content })
        }
      } catch {
        // ignore
      }
    }
    // Also try API
    fetch(`/api/website-builder/pages/${params.id}`)
      .then((r) => {
        if (r.ok) return r.json()
        return null
      })
      .then((data) => {
        if (data) {
          const content = Array.isArray(data.content) ? data.content : []
          setPage({ ...data, content })
        }
      })
      .catch(() => {})
  }, [params.id])

  if (!page) {
    return (
      <>
        <Header title="Page Editor" />
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading page...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title={`Editing: ${page.title}`} subtitle={page.slug} />
      <div className="p-6">
        <PageEditor page={page} />
      </div>
    </>
  )
}
