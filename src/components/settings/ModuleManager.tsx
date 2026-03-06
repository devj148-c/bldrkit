"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MODULE_REGISTRY } from "@/lib/modules/registry"
import { Check, Plus } from "lucide-react"

export function ModuleManager({ enabledKeys, isAdmin }: { enabledKeys: string[]; isAdmin: boolean }) {
  const [enabled, setEnabled] = useState<string[]>(enabledKeys)
  const [saving, setSaving] = useState<string | null>(null)

  async function toggleModule(key: string) {
    if (!isAdmin) return
    setSaving(key)
    const isEnabled = enabled.includes(key)

    try {
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleKey: key, action: isEnabled ? "disable" : "enable" }),
      })
      if (res.ok) {
        setEnabled((prev) =>
          isEnabled ? prev.filter((k) => k !== key) : [...prev, key]
        )
      }
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl">
      {MODULE_REGISTRY.map((mod) => {
        const isEnabled = enabled.includes(mod.key)
        return (
          <Card key={mod.key} className={isEnabled ? "border-primary" : ""}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{mod.name}</CardTitle>
                {isEnabled && (
                  <Badge className="bg-primary/20 text-primary">
                    <Check className="h-3 w-3 mr-1" /> Active
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">{mod.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Available Roles</p>
                <div className="flex flex-wrap gap-1">
                  {mod.roles.map((role) => (
                    <Badge key={role} variant="outline" className="text-[10px]">
                      {role.replace("_", " ")}
                    </Badge>
                  ))}
                </div>
              </div>
              {isAdmin && (
                <Button
                  size="sm"
                  variant={isEnabled ? "outline" : "default"}
                  className="w-full"
                  onClick={() => toggleModule(mod.key)}
                  disabled={saving === mod.key}
                >
                  {saving === mod.key
                    ? "Saving..."
                    : isEnabled
                    ? "Disable"
                    : <><Plus className="h-3 w-3 mr-1" /> Enable</>
                  }
                </Button>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
