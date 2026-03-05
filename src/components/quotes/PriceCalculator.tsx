"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MATERIALS = [
  { key: "asphalt", name: "Asphalt Shingles", min: 3.5, max: 5.5, color: "border-gray-400" },
  { key: "metal", name: "Metal Roofing", min: 7, max: 12, color: "border-slate-500" },
  { key: "tile", name: "Tile", min: 10, max: 18, color: "border-orange-400" },
  { key: "slate", name: "Slate", min: 15, max: 25, color: "border-indigo-400" },
  { key: "flat_tpo", name: "Flat/TPO", min: 5, max: 8, color: "border-blue-400" },
];

export function PriceCalculator({
  roofArea,
  selectedMaterial,
  onSelectMaterial,
}: {
  roofArea: number | null;
  selectedMaterial: string;
  onSelectMaterial: (material: string) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Material & Price Estimates</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MATERIALS.map((mat) => {
          const priceMin = roofArea ? Math.round(roofArea * mat.min) : 0;
          const priceMax = roofArea ? Math.round(roofArea * mat.max) : 0;
          const isSelected = selectedMaterial === mat.key;

          return (
            <Card
              key={mat.key}
              onClick={() => onSelectMaterial(mat.key)}
              className={`cursor-pointer transition-all border-l-4 ${mat.color} ${
                isSelected
                  ? "ring-2 ring-emerald-500 bg-emerald-50/50"
                  : "hover:shadow-md"
              }`}
            >
              <CardHeader className="pb-1 pt-3 px-3">
                <CardTitle className="text-sm">{mat.name}</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-xs text-gray-500">
                  ${mat.min.toFixed(2)} – ${mat.max.toFixed(2)} / sq ft
                </p>
                {roofArea && (
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    ${priceMin.toLocaleString()} – ${priceMax.toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
