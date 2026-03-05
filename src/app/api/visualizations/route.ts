import { NextRequest, NextResponse } from "next/server";
import { generateRoofVisualization } from "@/lib/openai";

export async function GET() {
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.originalImage || !body.material) {
      return NextResponse.json(
        { error: "Original image and material are required" },
        { status: 400 }
      );
    }

    const generatedImage = await generateRoofVisualization(
      body.originalImage,
      body.material,
      body.style
    );

    return NextResponse.json(
      {
        id: crypto.randomUUID(),
        originalImage: body.originalImage.substring(0, 100),
        generatedImage,
        material: body.material,
        style: body.style || null,
        status: generatedImage.includes("placeholder") ? "failed" : "complete",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create visualization error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
