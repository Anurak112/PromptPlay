// ─── Shared types for the multi-provider image generation system ───

export interface GenerateImageInput {
    prompt: string;
    width: number;
    height: number;
    seed?: number;
}

export interface GeneratedImageResult {
    id: string;
    url: string;
    prompt: string;
    model: string;
    provider: string;
    width: number;
    height: number;
}

export interface ImageProvider {
    /** Human-readable provider name */
    name: string;
    /** Generate a single image */
    generate(
        input: GenerateImageInput,
        modelId: string
    ): Promise<GeneratedImageResult>;
    /** Whether this provider has the required API keys configured */
    isConfigured(): boolean;
}

export interface ModelDefinition {
    /** Internal key used in API calls, e.g. "flux-pro-1.1" */
    id: string;
    /** Display name shown in the UI, e.g. "Flux Pro 1.1" */
    displayName: string;
    /** Provider key, e.g. "fal", "openai", "replicate", "pollinations" */
    provider: string;
    /** The actual model identifier for the provider's API */
    providerModelId: string;
    /** Access tier */
    tier: "free" | "pro";
}

// ─── Aspect ratio parser ───

export function parseAspectRatio(ratio: string): {
    width: number;
    height: number;
} {
    const map: Record<string, { width: number; height: number }> = {
        "1:1": { width: 1024, height: 1024 },
        "2:3": { width: 683, height: 1024 },
        "3:2": { width: 1024, height: 683 },
        "3:4": { width: 768, height: 1024 },
        "4:3": { width: 1024, height: 768 },
        "4:5": { width: 819, height: 1024 },
        "5:4": { width: 1024, height: 819 },
        "9:16": { width: 720, height: 1280 },
        "16:9": { width: 1280, height: 720 },
        "21:9": { width: 1344, height: 576 },
    };
    return map[ratio] || { width: 1024, height: 1024 };
}
