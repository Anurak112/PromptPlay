// ─── Multi-Provider Image Generation Registry ───
//
// This module ties everything together:
// 1. MODEL_REGISTRY  — all available models with metadata
// 2. getProvider()    — look up a provider by key
// 3. generateImage()  — high-level: model ID → provider → result

import type {
    ImageProvider,
    ModelDefinition,
    GenerateImageInput,
    GeneratedImageResult,
} from "./types";
import { parseAspectRatio } from "./types";
import { FalProvider } from "./fal";
import { OpenAIProvider } from "./openai";
import { ReplicateProvider } from "./replicate";
import { PollinationsProvider } from "./pollinations";

// ─── Provider instances (singletons) ───

const providers: Record<string, ImageProvider> = {
    fal: new FalProvider(),
    openai: new OpenAIProvider(),
    replicate: new ReplicateProvider(),
    pollinations: new PollinationsProvider(),
};

// ─── Model registry ───
// Each entry maps a UI model to a specific provider + provider-side model ID.

export const MODEL_REGISTRY: ModelDefinition[] = [
    // fal.ai models
    {
        id: "flux-pro-1.1",
        displayName: "Flux Pro 1.1",
        provider: "fal",
        providerModelId: "fal-ai/flux-pro/v1.1",
        tier: "pro",
    },
    {
        id: "flux-dev",
        displayName: "Flux Dev",
        provider: "fal",
        providerModelId: "fal-ai/flux/dev",
        tier: "pro",
    },
    {
        id: "flux-schnell",
        displayName: "Flux Schnell",
        provider: "fal",
        providerModelId: "fal-ai/flux/schnell",
        tier: "free",
    },
    {
        id: "sd-3.5-large",
        displayName: "SD 3.5 Large",
        provider: "fal",
        providerModelId: "fal-ai/stable-diffusion-v35-large",
        tier: "pro",
    },

    // OpenAI models
    {
        id: "dall-e-3",
        displayName: "DALL·E 3",
        provider: "openai",
        providerModelId: "dall-e-3",
        tier: "pro",
    },
    {
        id: "gpt-image-1",
        displayName: "GPT Image",
        provider: "openai",
        providerModelId: "gpt-image-1",
        tier: "pro",
    },

    // Replicate models
    {
        id: "flux-1.1-pro-replicate",
        displayName: "Flux 1.1 Pro (Replicate)",
        provider: "replicate",
        providerModelId: "black-forest-labs/flux-1.1-pro",
        tier: "pro",
    },
    {
        id: "sdxl-replicate",
        displayName: "SDXL (Replicate)",
        provider: "replicate",
        providerModelId: "stability-ai/sdxl",
        tier: "pro",
    },

    // Pollinations (free fallback) models
    {
        id: "pollinations-flux",
        displayName: "Flux (Free)",
        provider: "pollinations",
        providerModelId: "flux",
        tier: "free",
    },
    {
        id: "pollinations-turbo",
        displayName: "Turbo (Free)",
        provider: "pollinations",
        providerModelId: "turbo",
        tier: "free",
    },
];

// ─── Public API ───

export function getProvider(providerKey: string): ImageProvider | undefined {
    return providers[providerKey];
}

/**
 * Returns only the models whose provider is actually configured
 * (has valid API keys). Pollinations models are always included.
 */
export function getAvailableModels(): ModelDefinition[] {
    return MODEL_REGISTRY.filter((m) => {
        const provider = providers[m.provider];
        return provider?.isConfigured() ?? false;
    });
}

/**
 * High-level generation: looks up the model, finds its provider, and calls generate().
 */
export async function generateImage(
    modelId: string,
    input: GenerateImageInput
): Promise<GeneratedImageResult> {
    const model = MODEL_REGISTRY.find((m) => m.id === modelId);
    if (!model) {
        throw new Error(`Unknown model: "${modelId}"`);
    }

    const provider = providers[model.provider];
    if (!provider) {
        throw new Error(`Unknown provider: "${model.provider}"`);
    }

    if (!provider.isConfigured()) {
        throw new Error(
            `Provider "${provider.name}" is not configured. Please set the required API key.`
        );
    }

    return provider.generate(input, model.providerModelId);
}

// Re-export types and utilities
export { parseAspectRatio };
export type {
    ImageProvider,
    ModelDefinition,
    GenerateImageInput,
    GeneratedImageResult,
};
