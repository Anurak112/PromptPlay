"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";

// ─── Model type from API ───

export interface ModelInfo {
    id: string;
    displayName: string;
    provider: string;
    tier: "free" | "pro";
}

export const BATCH_COUNTS = [1, 2, 3, 4];

export const ASPECT_RATIOS = [
    "Auto", "1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"
];

// Provider badge colors
const PROVIDER_COLORS: Record<string, string> = {
    "fal.ai": "bg-violet-500/20 text-violet-300",
    "OpenAI": "bg-emerald-500/20 text-emerald-300",
    "Replicate": "bg-blue-500/20 text-blue-300",
    "Pollinations": "bg-amber-500/20 text-amber-300",
};

export interface GeneratorState {
    prompt: string;
    models: string[];
    batchCount: number;
    aspectRatio: string;
}

interface GeneratorControlsProps {
    state: GeneratorState;
    setState: React.Dispatch<React.SetStateAction<GeneratorState>>;
    onGenerate: () => void;
    isGenerating: boolean;
}

export function GeneratorControls({ state, setState, onGenerate, isGenerating }: GeneratorControlsProps) {
    const [availableModels, setAvailableModels] = React.useState<ModelInfo[]>([]);
    const [loadingModels, setLoadingModels] = React.useState(true);

    // Fetch available models from the API on mount
    React.useEffect(() => {
        async function fetchModels() {
            try {
                const res = await fetch("/api/generate");
                if (res.ok) {
                    const data = await res.json();
                    setAvailableModels(data.models ?? []);
                    // Auto-select the first free model if nothing is selected
                    if (data.models?.length > 0) {
                        const freeModel = data.models.find((m: ModelInfo) => m.tier === "free");
                        if (freeModel) {
                            setState((prev) => ({
                                ...prev,
                                models: prev.models.length === 0 ? [freeModel.id] : prev.models,
                            }));
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch models:", err);
            } finally {
                setLoadingModels(false);
            }
        }
        fetchModels();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleModel = (modelId: string) => {
        setState((prev) => ({
            ...prev,
            models: prev.models.includes(modelId)
                ? prev.models.filter((m) => m !== modelId)
                : [...prev.models, modelId]
        }));
    };

    return (
        <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col space-y-8 h-full">
            <div>
                <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-3 leading-tight tracking-tight">
                    Watermark-Free Multi-Model <br /> AI Image Generator
                </h1>
                <p className="text-muted-foreground text-sm">
                    Generate in parallel across models, compare results instantly, and export watermark-free images in one click.
                </p>
            </div>

            {/* Reference Images */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground/80">Reference Images (up to 8)</Label>
                <button className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-muted/50 transition-colors bg-card/30">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                </button>
            </div>

            {/* Prompt */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-foreground/80">Prompt</Label>
                    <span className="text-xs text-muted-foreground">{state.prompt.length}/10000</span>
                </div>
                <Textarea
                    placeholder="Describe the image you imagine or just run test"
                    className="min-h-[120px] resize-y bg-card/50"
                    value={state.prompt}
                    onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
                    disabled={isGenerating}
                />
            </div>

            {/* Models — dynamic from API */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground/80">
                    Models (Multiple Selection)
                    {!loadingModels && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground">
                            {availableModels.length} available
                        </span>
                    )}
                </Label>

                {loadingModels ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading models…
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {availableModels.map((model) => (
                            <label
                                key={model.id}
                                className={`flex items-start space-x-2 border rounded-lg p-3 cursor-pointer transition-colors ${state.models.includes(model.id) ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/20'}`}
                            >
                                <Checkbox
                                    checked={state.models.includes(model.id)}
                                    onCheckedChange={() => toggleModel(model.id)}
                                    className="mt-0.5"
                                    disabled={isGenerating}
                                />
                                <div className="flex flex-col gap-1 min-w-0">
                                    <span className="text-sm truncate pt-0.5 select-none">{model.displayName}</span>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${PROVIDER_COLORS[model.provider] || "bg-muted text-muted-foreground"}`}>
                                            {model.provider}
                                        </span>
                                        {model.tier === "free" && (
                                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-green-500/20 text-green-300">
                                                Free
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Batch Count */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground/80">Batch Count</Label>
                <div className="flex space-x-2">
                    {BATCH_COUNTS.map((count) => (
                        <button
                            key={count}
                            onClick={() => setState(prev => ({ ...prev, batchCount: count }))}
                            disabled={isGenerating}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${state.batchCount === count
                                ? "bg-primary text-primary-foreground"
                                : "border hover:bg-muted"
                                }`}
                        >
                            {count}
                        </button>
                    ))}
                </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-3">
                <Label className="text-sm font-semibold text-foreground/80">Aspect Ratio</Label>
                <div className="flex flex-wrap gap-2">
                    {ASPECT_RATIOS.map((ratio) => (
                        <button
                            key={ratio}
                            onClick={() => setState(prev => ({ ...prev, aspectRatio: ratio }))}
                            disabled={isGenerating}
                            className={`px-4 py-2 rounded-full text-xs font-medium transition-colors ${state.aspectRatio === ratio
                                ? "bg-primary text-primary-foreground"
                                : "border hover:bg-muted bg-card/30"
                                }`}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </div>

            {/* Credits and Generate */}
            <div className="mt-8 pt-6 border-t space-y-4 pb-12">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Credits</span>
                    <span className="font-semibold">50</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Cost</span>
                    <span className="font-semibold">{state.models.length * state.batchCount} Credits</span>
                </div>
                <Button
                    size="lg"
                    className="w-full text-lg font-bold rounded-xl h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-70 disabled:cursor-not-allowed"
                    onClick={onGenerate}
                    disabled={isGenerating || state.models.length === 0}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...
                        </>
                    ) : (
                        "Generate ✨"
                    )}
                </Button>
            </div>
        </div>
    );
}
