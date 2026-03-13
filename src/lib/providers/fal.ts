import type {
    ImageProvider,
    GenerateImageInput,
    GeneratedImageResult,
} from "./types";

/**
 * fal.ai provider — fast serverless GPU inference.
 * Supports Flux Pro/Dev/Schnell, Stable Diffusion 3.5, and more.
 * Docs: https://fal.ai/docs
 *
 * Requires FAL_KEY environment variable.
 */
export class FalProvider implements ImageProvider {
    name = "fal.ai";

    private get apiKey(): string | undefined {
        return process.env.FAL_KEY;
    }

    isConfigured(): boolean {
        return !!this.apiKey;
    }

    async generate(
        input: GenerateImageInput,
        modelId: string
    ): Promise<GeneratedImageResult> {
        if (!this.apiKey) {
            throw new Error("FAL_KEY is not configured");
        }

        // fal.ai REST endpoint: POST https://queue.fal.run/{modelId}
        const response = await fetch(`https://queue.fal.run/${modelId}`, {
            method: "POST",
            headers: {
                Authorization: `Key ${this.apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: input.prompt,
                image_size: {
                    width: input.width,
                    height: input.height,
                },
                seed: input.seed ?? Math.floor(Math.random() * 10_000_000),
                num_images: 1,
                // Enable safety checker by default
                enable_safety_checker: true,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`fal.ai error (${response.status}): ${err}`);
        }

        const data = await response.json();

        // fal.ai returns { images: [{ url, content_type, ... }], ... }
        const imageUrl =
            data?.images?.[0]?.url ?? data?.image?.url ?? data?.output?.url;

        if (!imageUrl) {
            throw new Error("fal.ai returned no image URL in response");
        }

        return {
            id: `fal-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            url: imageUrl,
            prompt: input.prompt,
            model: modelId,
            provider: this.name,
            width: input.width,
            height: input.height,
        };
    }
}
