import Link from "next/link"
import { QuoteWidget } from "@/components/quote-widget/QuoteWidget"
import { Button } from "@/components/ui/button"

interface QuotePageProps {
  searchParams: Promise<{ companyId?: string }>
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-bold text-primary">BLDR</span>
          <span className="text-xl font-bold">Kit</span>
        </Link>
        <Link href="/">
          <Button variant="ghost" size="sm">Back to Home</Button>
        </Link>
      </div>

      <main className="px-4 py-8 sm:py-10">
        <QuoteWidget companyId={params.companyId} companyName="BLDRKit Roofing Partner" />
      </main>
    </div>
  )
}
