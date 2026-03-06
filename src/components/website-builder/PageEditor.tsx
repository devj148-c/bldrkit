"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  ArrowLeft,
  GripVertical,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  Type,
  Image,
  Layout,
  Star,
  MessageSquare,
  HelpCircle,
  Megaphone,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

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

const BLOCK_TYPES = [
  { type: "hero" as const, label: "Hero Section", icon: Layout },
  { type: "text" as const, label: "Text Block", icon: Type },
  { type: "services-grid" as const, label: "Services Grid", icon: Image },
  { type: "testimonials" as const, label: "Testimonials", icon: Star },
  { type: "cta" as const, label: "Call to Action", icon: Megaphone },
  { type: "faq" as const, label: "FAQ", icon: HelpCircle },
  { type: "gallery" as const, label: "Gallery", icon: Image },
]

const BLOCK_ICONS: Record<string, typeof Layout> = {
  hero: Layout,
  text: Type,
  "services-grid": Image,
  testimonials: Star,
  cta: Megaphone,
  faq: HelpCircle,
  gallery: Image,
}

function generateId() {
  return Math.random().toString(36).substring(2, 11)
}

function getDefaultBlockData(type: ContentBlock["type"]): Record<string, string | string[]> {
  switch (type) {
    case "hero":
      return { heading: "Your Heading Here", subheading: "Your subheading text", buttonText: "Get Free Estimate" }
    case "text":
      return { heading: "Section Title", body: "Enter your content here. Click to edit." }
    case "services-grid":
      return { heading: "Our Services", services: ["Service 1", "Service 2", "Service 3"] }
    case "testimonials":
      return { heading: "What Our Customers Say", testimonials: ["Great service!", "Highly recommend!", "Professional team."] }
    case "cta":
      return { heading: "Ready to Get Started?", body: "Contact us today for a free estimate.", buttonText: "Book Now" }
    case "faq":
      return { heading: "Frequently Asked Questions", questions: ["How much does a new roof cost?", "How long does installation take?"] }
    case "gallery":
      return { heading: "Our Work" }
    default:
      return {}
  }
}

interface PageEditorProps {
  page: PageData
}

export function PageEditor({ page: initialPage }: PageEditorProps) {
  const [page, setPage] = useState<PageData>(initialPage)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editingBlock, setEditingBlock] = useState<string | null>(null)
  const [showAddBlock, setShowAddBlock] = useState(false)

  const updateBlock = useCallback((blockId: string, field: string, value: string | string[]) => {
    setPage((prev) => ({
      ...prev,
      content: prev.content.map((b) =>
        b.id === blockId ? { ...b, data: { ...b.data, [field]: value } } : b
      ),
    }))
    setSaved(false)
  }, [])

  const moveBlock = useCallback((index: number, direction: -1 | 1) => {
    setPage((prev) => {
      const newContent = [...prev.content]
      const newIndex = index + direction
      if (newIndex < 0 || newIndex >= newContent.length) return prev
      const temp = newContent[index]
      newContent[index] = newContent[newIndex]
      newContent[newIndex] = temp
      return { ...prev, content: newContent }
    })
    setSaved(false)
  }, [])

  const deleteBlock = useCallback((blockId: string) => {
    setPage((prev) => ({
      ...prev,
      content: prev.content.filter((b) => b.id !== blockId),
    }))
    setSaved(false)
  }, [])

  const addBlock = useCallback((type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: generateId(),
      type,
      data: getDefaultBlockData(type),
    }
    setPage((prev) => ({
      ...prev,
      content: [...prev.content, newBlock],
    }))
    setShowAddBlock(false)
    setSaved(false)
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/website-builder/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          metaTitle: page.metaTitle,
          metaDescription: page.metaDescription,
          h1: page.h1,
          content: page.content,
        }),
      })
      // Also save to localStorage
      const stored = localStorage.getItem("bldrkit-website")
      if (stored) {
        const websiteData = JSON.parse(stored)
        websiteData.pages = websiteData.pages.map((p: PageData) =>
          p.id === page.id ? { ...p, ...page } : p
        )
        localStorage.setItem("bldrkit-website", JSON.stringify(websiteData))
      }
      setSaved(true)
    } catch {
      // Handle error silently
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/website-builder"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" /> Preview
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || saved}>
            <Save className="h-4 w-4 mr-1" />
            {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Page Meta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Page Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Page Title</label>
              <Input
                value={page.title}
                onChange={(e) => {
                  setPage((p) => ({ ...p, title: e.target.value }))
                  setSaved(false)
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">SEO Title</label>
              <Input
                value={page.metaTitle}
                onChange={(e) => {
                  setPage((p) => ({ ...p, metaTitle: e.target.value }))
                  setSaved(false)
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Meta Description</label>
            <Textarea
              value={page.metaDescription}
              onChange={(e) => {
                setPage((p) => ({ ...p, metaDescription: e.target.value }))
                setSaved(false)
              }}
              rows={2}
            />
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{page.pageType}</Badge>
            <span className="text-xs text-muted-foreground">{page.slug}</span>
          </div>
        </CardContent>
      </Card>

      {/* Content Blocks */}
      <div className="space-y-3">
        {page.content.map((block, index) => {
          const Icon = BLOCK_ICONS[block.type] || Type
          const isEditing = editingBlock === block.id
          return (
            <Card
              key={block.id}
              className={cn(
                "transition-all",
                isEditing ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/30"
              )}
            >
              <div className="flex items-center gap-2 p-3 border-b">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium capitalize">{block.type.replace("-", " ")}</span>
                <div className="ml-auto flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => moveBlock(index, -1)}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => moveBlock(index, 1)}
                    disabled={index === page.content.length - 1}
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => setEditingBlock(isEditing ? null : block.id)}
                  >
                    <MessageSquare className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                    onClick={() => deleteBlock(block.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <CardContent className="pt-4">
                {isEditing ? (
                  <BlockEditor block={block} onUpdate={updateBlock} />
                ) : (
                  <BlockPreview block={block} onClick={() => setEditingBlock(block.id)} />
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Add Block */}
      {showAddBlock ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium mb-3">Add a section:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BLOCK_TYPES.map((bt) => (
                <button
                  key={bt.type}
                  onClick={() => addBlock(bt.type)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors text-sm"
                >
                  <bt.icon className="h-5 w-5 text-muted-foreground" />
                  {bt.label}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={() => setShowAddBlock(false)}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          className="w-full border-dashed"
          onClick={() => setShowAddBlock(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Section
        </Button>
      )}
    </div>
  )
}

function BlockEditor({
  block,
  onUpdate,
}: {
  block: ContentBlock
  onUpdate: (id: string, field: string, value: string | string[]) => void
}) {
  const fields = Object.entries(block.data)
  return (
    <div className="space-y-3">
      {fields.map(([key, value]) => (
        <div key={key} className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground capitalize">
            {key.replace(/([A-Z])/g, " $1")}
          </label>
          {Array.isArray(value) ? (
            <Textarea
              value={value.join("\n")}
              onChange={(e) => onUpdate(block.id, key, e.target.value.split("\n"))}
              rows={Math.min(value.length + 1, 6)}
              placeholder="One item per line"
            />
          ) : typeof value === "string" && value.length > 80 ? (
            <Textarea
              value={value}
              onChange={(e) => onUpdate(block.id, key, e.target.value)}
              rows={4}
            />
          ) : (
            <Input
              value={value}
              onChange={(e) => onUpdate(block.id, key, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function BlockPreview({ block, onClick }: { block: ContentBlock; onClick: () => void }) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      {block.type === "hero" && (
        <div className="text-center py-4">
          <h2 className="text-xl font-bold">{String(block.data.heading || "")}</h2>
          <p className="text-muted-foreground mt-1">{String(block.data.subheading || "")}</p>
          {block.data.buttonText && (
            <span className="inline-block mt-2 px-4 py-1 bg-primary/10 text-primary text-sm rounded-full">
              {String(block.data.buttonText)}
            </span>
          )}
        </div>
      )}
      {block.type === "text" && (
        <div>
          <h3 className="font-semibold">{String(block.data.heading || "")}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{String(block.data.body || "")}</p>
        </div>
      )}
      {block.type === "services-grid" && (
        <div>
          <h3 className="font-semibold">{String(block.data.heading || "")}</h3>
          <div className="flex flex-wrap gap-1 mt-2">
            {Array.isArray(block.data.services) &&
              block.data.services.map((s, i) => (
                <Badge key={i} variant="secondary">
                  {s}
                </Badge>
              ))}
          </div>
        </div>
      )}
      {block.type === "testimonials" && (
        <div>
          <h3 className="font-semibold">{String(block.data.heading || "")}</h3>
          <p className="text-sm text-muted-foreground mt-1 italic">
            &ldquo;{Array.isArray(block.data.testimonials) ? block.data.testimonials[0] : ""}&rdquo;
          </p>
        </div>
      )}
      {block.type === "cta" && (
        <div className="text-center py-2">
          <h3 className="font-semibold">{String(block.data.heading || "")}</h3>
          <p className="text-sm text-muted-foreground mt-1">{String(block.data.body || "")}</p>
        </div>
      )}
      {block.type === "faq" && (
        <div>
          <h3 className="font-semibold">{String(block.data.heading || "")}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {Array.isArray(block.data.questions) ? `${block.data.questions.length} questions` : ""}
          </p>
        </div>
      )}
      {block.type === "gallery" && (
        <div>
          <h3 className="font-semibold">{String(block.data.heading || "Our Work")}</h3>
          <p className="text-sm text-muted-foreground mt-1">Photo gallery section</p>
        </div>
      )}
    </div>
  )
}
