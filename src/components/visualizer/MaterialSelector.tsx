"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const MATERIALS = [
  { id: "asphalt", name: "Asphalt Shingles", styles: ["Architectural", "3-Tab", "Designer"] },
  { id: "metal", name: "Metal Roofing", styles: ["Standing Seam", "Corrugated", "Metal Shingle"] },
  { id: "tile", name: "Tile", styles: ["Spanish", "Flat", "Barrel"] },
  { id: "slate", name: "Slate", styles: ["Natural", "Synthetic", "Patterned"] },
  { id: "cedar", name: "Cedar Shake", styles: ["Hand Split", "Tapersawn", "Fancy Cut"] },
];

const CLIMATES = [
  { value: "hot_dry", label: "Hot & Dry" },
  { value: "cold_snow", label: "Cold & Snow" },
  { value: "humid_tropical", label: "Humid & Tropical" },
  { value: "temperate", label: "Temperate" },
  { value: "coastal", label: "Coastal" },
];

const AESTHETICS = [
  { value: "modern", label: "Modern" },
  { value: "traditional", label: "Traditional" },
  { value: "rustic", label: "Rustic" },
];

const PRIORITIES = [
  { value: "durability", label: "Durability" },
  { value: "energy_efficiency", label: "Energy Efficiency" },
  { value: "curb_appeal", label: "Curb Appeal" },
  { value: "low_maintenance", label: "Low Maintenance" },
];

interface MaterialSelectorProps {
  material: string;
  style: string;
  budget: number;
  climate: string;
  aesthetic: string;
  priority: string;
  onMaterialChange: (material: string) => void;
  onStyleChange: (style: string) => void;
  onBudgetChange: (budget: number) => void;
  onClimateChange: (climate: string) => void;
  onAestheticChange: (aesthetic: string) => void;
  onPriorityChange: (priority: string) => void;
}

export function MaterialSelector({
  material,
  style,
  budget,
  climate,
  aesthetic,
  priority,
  onMaterialChange,
  onStyleChange,
  onBudgetChange,
  onClimateChange,
  onAestheticChange,
  onPriorityChange,
}: MaterialSelectorProps) {
  const selectedMat = MATERIALS.find((m) => m.id === material);

  return (
    <div className="space-y-4">
      {/* Material selection */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Roofing Material</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {MATERIALS.map((mat) => (
            <button
              key={mat.id}
              onClick={() => {
                onMaterialChange(mat.id);
                onStyleChange(mat.styles[0]);
              }}
              className={cn(
                "rounded-lg border p-3 text-center text-sm font-medium transition-all",
                material === mat.id
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              {mat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Style selection */}
      {selectedMat && (
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Style</Label>
          <div className="flex flex-wrap gap-2">
            {selectedMat.styles.map((s) => (
              <button
                key={s}
                onClick={() => onStyleChange(s)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  style === s
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations section */}
      <Card>
        <CardContent className="space-y-4 pt-4">
          <h4 className="text-sm font-semibold">Material Recommendation Preferences</h4>

          <div className="space-y-2">
            <Label className="text-xs text-gray-500">
              Budget: {budget <= 33 ? "Budget" : budget <= 66 ? "Mid-Range" : "Premium"}
            </Label>
            <Slider
              value={[budget]}
              onValueChange={([v]) => onBudgetChange(v)}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>Budget</span>
              <span>Premium</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Climate</Label>
              <Select value={climate} onValueChange={onClimateChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CLIMATES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Aesthetic</Label>
              <Select value={aesthetic} onValueChange={onAestheticChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AESTHETICS.map((a) => (
                    <SelectItem key={a.value} value={a.value}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-500">Priority</Label>
              <Select value={priority} onValueChange={onPriorityChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
