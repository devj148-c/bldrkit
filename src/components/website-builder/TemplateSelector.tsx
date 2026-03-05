"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const templates = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean lines, bold typography, minimalist design",
    preview: "bg-gradient-to-br from-slate-900 to-slate-700",
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional layout, warm colors, trustworthy feel",
    preview: "bg-gradient-to-br from-amber-800 to-amber-600",
  },
  {
    id: "bold",
    name: "Bold",
    description: "High-contrast, large imagery, attention-grabbing",
    preview: "bg-gradient-to-br from-emerald-700 to-cyan-600",
  },
];

export function TemplateSelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (template: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Choose Template</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {templates.map((t) => (
          <Card
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={cn(
              "cursor-pointer transition-all overflow-hidden",
              selected === t.id && "ring-2 ring-emerald-500"
            )}
          >
            <div className={`h-24 ${t.preview} relative`}>
              {selected === t.id && (
                <div className="absolute top-2 right-2 rounded-full bg-emerald-500 p-1">
                  <Check size={14} className="text-white" />
                </div>
              )}
              <div className="absolute bottom-2 left-3">
                <div className="h-2 w-16 rounded bg-white/30" />
                <div className="mt-1 h-1.5 w-24 rounded bg-white/20" />
              </div>
            </div>
            <CardContent className="p-3">
              <p className="font-medium text-sm">{t.name}</p>
              <p className="text-xs text-gray-500">{t.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
