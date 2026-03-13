import { NextResponse } from "next/server";
import {
    generateImage,
    getAvailableModels,
    parseAspectRatio,
} from "@/lib/providers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { prompt, models, batchCount, aspectRatio } = body;

        if (!prompt || !models || models.length === 0) {
            return NextResponse.json(
                { error: "Missing required fields: prompt or models." },
                { status: 400 }
            );
        }

        // Validate that requested models exist and are available
        const availableModels = getAvailableModels();
        const availableIds = new Set(availableModels.map((m) => m.id));

        const invalidModels = (models as string[]).filter(
            (id) => !availableIds.has(id)
        );
        if (invalidModels.length > 0) {
            return NextResponse.json(
                {
                    error: `Models not available: ${invalidModels.join(", ")}. Provider may not be configured.`,
                },
                { status: 400 }
            );
        }

        // Parse aspect ratio into width × height
        const { width, height } = parseAspectRatio(aspectRatio || "Auto");

        // Fan out all generation requests concurrently
        const generatePromises = [];

        for (const modelId of models as string[]) {
            for (let i = 0; i < (batchCount || 1); i++) {
                generatePromises.push(
                    generateImage(modelId, {
                        prompt,
                        width,
                        height,
                        seed: Math.floor(Math.random() * 10_000_000),
                    })
                        .then((result) => ({
                            status: "fulfilled" as const,
                            value: {
                                id: result.id,
                                src: result.url,
                                prompt: result.prompt,
                                model:
                                    availableModels.find((m) => m.id === modelId)?.displayName ??
                                    modelId,
                                provider: result.provider,
                                // Random masonry height for the UI grid
                                height: `h-[${Math.floor(Math.random() * (600 - 300 + 1) + 300)}px]`,
                            },
                        }))
                        .catch((error) => ({
                            status: "rejected" as const,
                            reason: error?.message || "Generation failed",
                            model: modelId,
                        }))
                );
            }
        }

        const results = await Promise.all(generatePromises);

        const images = results
            .filter((r) => r.status === "fulfilled")
            .map((r) => (r as { status: "fulfilled"; value: object }).value);

        const errors = results
            .filter((r) => r.status === "rejected")
            .map(
                (r) =>
                    r as { status: "rejected"; reason: string; model: string }
            );

        return NextResponse.json({
            success: true,
            images,
            ...(errors.length > 0 && {
                warnings: errors.map((e) => `${e.model}: ${e.reason}`),
            }),
        });
    } catch (error: unknown) {
        console.error("Image generation error:", error);
        const message =
            error instanceof Error ? error.message : "Failed to generate image.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

/**
 * GET /api/generate — returns the list of available models.
 * Used by the client to dynamically populate the model selector.
 */
export async function GET() {
    const models = getAvailableModels();
    return NextResponse.json({ models });
}
