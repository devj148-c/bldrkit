"use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function RoofEstimate({
  roofArea,
  confidence,
  reasoning,
}: {
  roofArea: number | null;
  confidence: string | null;
  reasoning: string | null;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Satellite placeholder */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-gray-800">
          <Image
            src="/placeholder-satellite.svg"
            alt="Satellite view placeholder"
            fill
            className="object-cover"
          />
        </div>
      </Card>

      {/* Estimate card */}
      <Card>
        <CardContent className="flex h-full flex-col justify-center p-6">
          {roofArea ? (
            <>
              <p className="text-sm text-gray-500">Estimated Roof Area</p>
              <p className="mt-1 text-4xl font-bold text-gray-900">
                {roofArea.toLocaleString()} <span className="text-lg font-normal text-gray-500">sq ft</span>
              </p>
              {confidence && (
                <p className="mt-2 text-sm">
                  Confidence:{" "}
                  <span
                    className={`font-medium ${
                      confidence === "high"
                        ? "text-emerald-600"
                        : confidence === "medium"
                        ? "text-amber-600"
                        : "text-gray-500"
                    }`}
                  >
                    {confidence}
                  </span>
                </p>
              )}
              {reasoning && (
                <p className="mt-2 text-sm text-gray-500">{reasoning}</p>
              )}
            </>
          ) : (
            <div className="text-center text-gray-400">
              <p className="text-lg font-medium">Enter an address</p>
              <p className="text-sm">AI will estimate the roof area</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
