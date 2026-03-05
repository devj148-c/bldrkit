"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { PhotoUpload } from "@/components/visualizer/PhotoUpload";
import { MaterialSelector } from "@/components/visualizer/MaterialSelector";
import { VisualizationResult } from "@/components/visualizer/VisualizationResult";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Paintbrush, Loader2, Lightbulb } from "lucide-react";

const RECOMMENDATIONS: Record<string, Record<string, string>> = {
  hot_dry: {
    budget: "Consider light-colored asphalt shingles — affordable and reflects heat well.",
    mid: "Metal roofing with a reflective coating offers great energy efficiency in hot climates.",
    premium: "Clay tile is the classic choice for hot, dry climates — excellent longevity.",
  },
  cold_snow: {
    budget: "Architectural asphalt shingles handle snow loads well at a reasonable price.",
    mid: "Metal roofing sheds snow easily and prevents ice dams.",
    premium: "Slate is extremely durable against freeze-thaw cycles for decades.",
  },
  humid_tropical: {
    budget: "Algae-resistant asphalt shingles are designed for humid environments.",
    mid: "Metal roofing resists mold and mildew better than most materials.",
    premium: "Concrete tile handles humidity well and offers excellent wind resistance.",
  },
  temperate: {
    budget: "Standard architectural asphalt shingles are versatile for temperate climates.",
    mid: "Metal or composite shingles offer a great balance of durability and aesthetics.",
    premium: "Cedar shake provides natural insulation and timeless beauty.",
  },
  coastal: {
    budget: "Look for wind-rated asphalt shingles designed for coastal conditions.",
    mid: "Aluminum metal roofing resists salt air corrosion.",
    premium: "Synthetic slate combines coastal durability with elegant appearance.",
  },
};

export default function VisualizerPage() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [material, setMaterial] = useState("asphalt");
  const [style, setStyle] = useState("Architectural");
  const [budget, setBudget] = useState(50);
  const [climate, setClimate] = useState("temperate");
  const [aesthetic, setAesthetic] = useState("modern");
  const [priority, setPriority] = useState("durability");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!photo) return;
    setLoading(true);
    setGeneratedImage(null);

    try {
      const res = await fetch("/api/visualizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalImage: photo,
          material,
          style,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedImage(data.generatedImage || "/placeholder-visualization.svg");
      } else {
        setGeneratedImage("/placeholder-visualization.svg");
      }
    } catch {
      setGeneratedImage("/placeholder-visualization.svg");
    } finally {
      setLoading(false);
    }
  }

  const budgetTier = budget <= 33 ? "budget" : budget <= 66 ? "mid" : "premium";
  const recommendation = RECOMMENDATIONS[climate]?.[budgetTier] || RECOMMENDATIONS.temperate.mid;

  return (
    <div className="flex flex-col">
      <Header title="AI Visualizer" />
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-amber-500 p-2 text-white">
            <Paintbrush size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold">AI Roof Visualization</h2>
            <p className="text-sm text-gray-500">
              Upload a photo of any roof and see it transformed with different materials
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <PhotoUpload
              imageUrl={photo}
              onUpload={setPhoto}
              onClear={() => {
                setPhoto(null);
                setGeneratedImage(null);
              }}
            />

            <MaterialSelector
              material={material}
              style={style}
              budget={budget}
              climate={climate}
              aesthetic={aesthetic}
              priority={priority}
              onMaterialChange={setMaterial}
              onStyleChange={setStyle}
              onBudgetChange={setBudget}
              onClimateChange={setClimate}
              onAestheticChange={setAesthetic}
              onPriorityChange={setPriority}
            />

            <Button
              onClick={handleGenerate}
              disabled={!photo || loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Generating Visualization...
                </>
              ) : (
                <>
                  <Paintbrush size={18} className="mr-2" />
                  Generate Visualization
                </>
              )}
            </Button>
          </div>

          <div className="space-y-6">
            {loading && photo ? (
              <Card className="overflow-hidden">
                <div className="bg-gray-100 px-3 py-2 text-xs font-medium text-gray-500">
                  Generating AI Visualization...
                </div>
                <div className="relative flex aspect-square items-center justify-center bg-gray-50">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="relative">
                      <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-emerald-500" />
                      <Paintbrush size={20} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Analyzing your roof...</p>
                      <p className="mt-1 text-xs text-gray-400">GPT-4o is studying your home, then DALL·E 3 will render the new roof. This takes 15-20 seconds.</p>
                    </div>
                  </div>
                </div>
              </Card>
            ) : generatedImage && photo ? (
              <VisualizationResult
                originalImage={photo}
                generatedImage={generatedImage}
                material={material}
                style={style}
              />
            ) : (
              <Card className="flex h-64 items-center justify-center">
                <CardContent className="text-center">
                  <Paintbrush size={40} className="mx-auto text-gray-300" />
                  <p className="mt-3 text-sm text-gray-400">
                    Upload a photo and select materials to generate a visualization
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Recommendation */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Lightbulb size={16} className="text-amber-500" />
                  Material Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{recommendation}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                  <span>Climate: {climate.replace("_", " ")}</span>
                  <span>·</span>
                  <span>Budget: {budgetTier}</span>
                  <span>·</span>
                  <span>Style: {aesthetic}</span>
                  <span>·</span>
                  <span>Priority: {priority.replace("_", " ")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
