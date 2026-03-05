"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2 } from "lucide-react";
import Image from "next/image";

export function VisualizationResult({
  originalImage,
  generatedImage,
  material,
  style,
}: {
  originalImage: string;
  generatedImage: string;
  material: string;
  style: string;
}) {
  function handleDownload() {
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `roof-visualization-${material}-${style}.png`;
    link.click();
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Roof Visualization",
          text: `Check out this ${material} roof visualization!`,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  }

  const isPlaceholder = generatedImage.includes("placeholder");

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">Comparison</h3>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="bg-gray-100 px-3 py-2 text-xs font-medium text-gray-500">
            Original Photo
          </div>
          <div className="relative aspect-square">
            <img
              src={originalImage}
              alt="Original roof"
              className="h-full w-full object-cover"
            />
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            AI Visualization — {material} ({style})
          </div>
          <div className="relative aspect-square">
            {isPlaceholder ? (
              <Image
                src={generatedImage}
                alt="AI visualization placeholder"
                fill
                className="object-cover"
              />
            ) : (
              <img
                src={generatedImage}
                alt="AI generated roof visualization"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </Card>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleDownload} variant="outline" disabled={isPlaceholder}>
          <Download size={16} className="mr-2" />
          Download
        </Button>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <Button onClick={handleShare} variant="outline" disabled={isPlaceholder}>
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
        )}
      </div>

      {isPlaceholder && (
        <p className="text-xs text-gray-500">
          Connect your OpenAI API key in environment variables to generate real AI visualizations.
        </p>
      )}
    </div>
  );
}
