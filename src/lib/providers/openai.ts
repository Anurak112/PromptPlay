import type {
    ImageProvider,
    GenerateImageInput,
    GeneratedImageResult,
} from "./types";

/**
 * OpenAI provider — DALL·E 3 and GPT Image.
 * Docs: https://platform.openai.com/docs/api-reference/images/create
 *
 * Requires OPENAI_API_KEY environment variable.
 */
export class OpenAIProvider implements ImageProvider {
    name = "OpenAI";

    private get apiKey(): string | undefined {
        return process.env.OPENAI_API_KEY;
    }

    isConfigured(): boolean {
        return !!this.apiKey;
    }

    /**
     * Map our width×height to the closest OpenAI-supported size.
     * DALL-E 3 supports: 1024x1024, 1024x1792, 1792x1024.
     */
    private getClosestSize(
        width: number,
        height: number
    ): { size: string; w: number; h: number } {
        const ratio = width / height;
        if (ratio > 1.3) return { size: "1792x1024", w: 1792, h: 1024 };
        if (ratio < 0.77) return { size: "1024x1792", w: 1024, h: 1792 };
        return { size: "1024x1024", w: 1024, h: 1024 };
    }

    async generate(
        input: GenerateImageInput,
        modelId: string
    ): Promise<GeneratedImageResult> {
        if (!this.apiKey) {
            throw new Error("OPENAI_API_KEY is not configured");
        }

        const { size, w, h } = this.getClosestSize(input.width, input.height);

        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: modelId,
                    prompt: input.prompt,
                    n: 1,
                    size,
                    quality: "hd",
                    response_format: "url",
                }),
            }
        );

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`OpenAI error (${response.status}): ${err}`);
        }

        const data = await response.json();
        const imageUrl = data?.data?.[0]?.url;

        if (!imageUrl) {
            throw new Error("OpenAI returned no image URL in response");
        }

        return {
            id: `oai-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            url: imageUrl,
            prompt: input.prompt,
            model: modelId,
            provider: this.name,
            width: w,
            height: h,
        };
    }
}
