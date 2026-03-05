import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function estimateRoofArea(address: string): Promise<{
  estimatedSqFt: number;
  confidence: string;
  reasoning: string;
}> {
  if (!process.env.OPENAI_API_KEY) {
    return {
      estimatedSqFt: 1800,
      confidence: "demo",
      reasoning:
        "Demo mode: OpenAI API key not configured. Using default estimate of 1,800 sq ft for a typical residential home.",
    };
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are a roofing estimation expert. Given an address, estimate the roof area in square feet. Consider typical home sizes for the area. Return JSON with fields: estimatedSqFt (number), confidence (low/medium/high), reasoning (brief explanation).",
      },
      {
        role: "user",
        content: `Estimate the roof area for the property at: ${address}. Consider that roof area is typically 1.5x the building footprint due to slope. Return valid JSON only.`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    return {
      estimatedSqFt: 1800,
      confidence: "low",
      reasoning: "Unable to generate estimate. Using default value.",
    };
  }

  return JSON.parse(content);
}

export async function generateRoofVisualization(
  originalImageUrl: string,
  material: string,
  style?: string
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return "/placeholder-visualization.svg";
  }

  // Step 1: Use GPT-4o vision to analyze the actual uploaded photo
  const analysisResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an architectural photography expert. Analyze this house photo and describe it in precise detail for image generation. Include: house style (colonial, craftsman, cape cod, modern, etc.), siding color and material, number of stories, roof shape (gable, hip, mansard, etc.), surrounding landscape, weather/lighting, viewing angle, and any distinctive features (bay windows, dormers, garage, etc.). Be specific and concise — this description will be used to regenerate the house with a different roof material.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Describe this house in detail for image regeneration.",
          },
          {
            type: "image_url",
            image_url: { url: originalImageUrl, detail: "high" },
          },
        ],
      },
    ],
    max_tokens: 500,
    temperature: 0.3,
  });

  const houseDescription =
    analysisResponse.choices[0]?.message?.content ||
    "A residential home viewed from the front";

  // Step 2: Generate new image with DALL-E 3 using the actual house description + new roof material
  const materialDescriptions: Record<string, string> = {
    asphalt: "architectural asphalt shingles",
    metal: "standing seam metal roofing",
    tile: "clay tile roofing",
    slate: "natural slate roofing",
    cedar: "cedar shake shingles",
  };

  const materialDesc = materialDescriptions[material] || material;
  const styleNote = style ? ` in a ${style} style` : "";

  const prompt = `Photorealistic image of this exact house: ${houseDescription}. BUT the roof has been replaced with brand new ${materialDesc}${styleNote}. The roof should look freshly and professionally installed, with perfect ${materialDesc} visible. Everything else about the house (siding, windows, landscaping, lighting, angle) stays exactly the same. High quality architectural photography, same perspective as the original.`;

  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "hd",
  });

  return response.data?.[0]?.url || "/placeholder-visualization.svg";
}
