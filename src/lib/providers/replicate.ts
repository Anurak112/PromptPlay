import type {
    ImageProvider,
    GenerateImageInput,
    GeneratedImageResult,
} from "./types";

/**
 * Replicate provider — wide model ecosystem.
 * Docs: https://replicate.com/docs/reference/http
 *
 * Requires REPLICATE_API_TOKEN environment variable.
 */
export class ReplicateProvider implements ImageProvider {
    name = "Replicate";

    private get apiToken(): string | undefined {
        return process.env.REPLICATE_API_TOKEN;
    }

    isConfigured(): boolean {
        return !!this.apiToken;
    }

    async generate(
        input: GenerateImageInput,
        modelId: string
    ): Promise<GeneratedImageResult> {
        if (!this.apiToken) {
            throw new Error("REPLICATE_API_TOKEN is not configured");
        }

        // Step 1: Create a prediction
        const createRes = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.apiToken}`,
                "Content-Type": "application/json",
                Prefer: "wait", // Replicate will hold the connection until done (up to 60s)
            },
            body: JSON.stringify({
                model: modelId,
                input: {
                    prompt: input.prompt,
                    width: input.width,
                    height: input.height,
                    seed: input.seed ?? Math.floor(Math.random() * 10_000_000),
                    num_outputs: 1,
                },
            }),
        });

        if (!createRes.ok) {
            const err = await createRes.text();
            throw new Error(`Replicate error (${createRes.status}): ${err}`);
        }

        let prediction = await createRes.json();

        // Step 2: If not completed yet (Prefer:wait may not always work), poll
        if (
            prediction.status !== "succeeded" &&
            prediction.status !== "failed"
        ) {
            prediction = await this.pollPrediction(prediction.id);
        }

        if (prediction.status === "failed") {
            throw new Error(
                `Replicate prediction failed: ${prediction.error || "Unknown error"}`
            );
        }

        // Output is typically an array of URLs
        const output = prediction.output;
        const imageUrl = Array.isArray(output) ? output[0] : output;

        if (!imageUrl) {
            throw new Error("Replicate returned no image URL in output");
        }

        return {
            id: `rep-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            url: imageUrl,
            prompt: input.prompt,
            model: modelId,
            provider: this.name,
            width: input.width,
            height: input.height,
        };
    }

    private async pollPrediction(
        id: string,
        maxAttempts = 30,
        intervalMs = 2000
    ) {
        for (let i = 0; i < maxAttempts; i++) {
            await new Promise((r) => setTimeout(r, intervalMs));

            const res = await fetch(
                `https://api.replicate.com/v1/predictions/${id}`,
                {
                    headers: { Authorization: `Bearer ${this.apiToken}` },
                }
            );

            if (!res.ok) {
                throw new Error(`Replicate poll error (${res.status})`);
            }

            const data = await res.json();
            if (data.status === "succeeded" || data.status === "failed") {
                return data;
            }
        }
        throw new Error("Replicate prediction timed out");
    }
}
