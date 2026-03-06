"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Wrench } from "lucide-react"
import Link from "next/link"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isDBError = error.message?.includes("prisma") || 
                    error.message?.includes("connection") ||
                    error.message?.includes("database") ||
                    error.message?.includes("ECONNREFUSED") ||
                    error.message?.includes("DATABASE_URL")

  return (
    <div className="p-6 flex items-center justify-center min-h-[50vh]">
      <Card className="max-w-lg w-full">
        <CardContent className="pt-6 text-center space-y-4">
          {isDBError ? (
            <>
              <Wrench className="h-12 w-12 text-yellow-500 mx-auto" />
              <h2 className="text-xl font-bold">Database Not Connected</h2>
              <p className="text-muted-foreground text-sm">
                BLDRKit needs a PostgreSQL database to store your data. 
                This is a one-time setup that takes about 2 minutes.
              </p>
              <div className="bg-muted rounded-lg p-4 text-left text-sm space-y-2">
                <p className="font-medium">Quick Fix:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Create a free database at <span className="text-primary">neon.tech</span></li>
                  <li>Copy your connection string</li>
                  <li>Run: <code className="bg-background px-1 rounded">./scripts/setup-db.sh &quot;your_connection_string&quot;</code></li>
                </ol>
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={reset} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Link href="/quick-estimate">
                  <Button size="sm">
                    Try Quick Estimate Instead
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <h2 className="text-xl font-bold">Something went wrong</h2>
              <p className="text-muted-foreground text-sm">{error.message || "An unexpected error occurred."}</p>
              <Button onClick={reset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
