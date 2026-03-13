import type {
    ImageProvider,
    GenerateImageInput,
    GeneratedImageResult,
} from "./types";

/**
 * Pollinations.ai — free, no-auth image generation.
 * Used as the default fallback when no API keys are configured.
 * Docs: https://pollinations.ai/
 */
export class PollinationsProvider implements ImageProvider {
    name = "Pollinations";

    isConfigured(): boolean {
        // Always available — no API key needed
        return true;
    }

    async generate(
        input: GenerateImageInput,
        modelId: string
    ): Promise<GeneratedImageResult> {
        const seed =
            input.seed ?? Math.floor(Math.random() * 10_000_000);
        const encodedPrompt = encodeURIComponent(input.prompt);

        // Pollinations supports model variants: "flux", "turbo", etc.
        const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=${input.width}&height=${input.height}&model=${modelId}&nologo=true`;

        // Verify the endpoint is reachable (HEAD request for speed)
        const check = await fetch(url, { method: "HEAD" });
        if (!check.ok) {
            throw new Error(
                `Pollinations returned ${check.status} for model "${modelId}"`
            );
        }

        return {
            id: `poll-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            url,
            prompt: input.prompt,
            model: modelId,
            provider: this.name,
            width: input.width,
            height: input.height,
        };
    }
}
