"use client";

import * as React from "react";
import { GeneratorControls, GeneratorState } from "@/components/generator/generator-controls";
import { GeneratorHistory, GeneratedImage } from "@/components/generator/generator-history";
import { toast } from "sonner"; // Using sonner if available, else we can simulate. Will check below.

// Initial dummy history data with varying heights for masonry
const INITIAL_HISTORY: GeneratedImage[] = [
    { id: 1, height: "h-[500px]", src: "https://images.unsplash.com/photo-1544526226-d4568090ffa0", model: "Flux (Free)" },
    { id: 2, height: "h-[300px]", src: "https://images.unsplash.com/photo-1517841905240-472988babdf9", model: "DALL·E 3" },
    { id: 3, height: "h-[400px]", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", model: "Flux Pro 1.1" },
    { id: 4, height: "h-[450px]", src: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8", model: "SD 3.5 Large" },
    { id: 5, height: "h-[600px]", src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1", model: "GPT Image" },
    { id: 6, height: "h-[350px]", src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d", model: "Turbo (Free)" },
];

export default function CreatePage() {
    const [state, setState] = React.useState<GeneratorState>({
        prompt: "",
        models: [], // Auto-selected by GeneratorControls on model fetch
        batchCount: 1,
        aspectRatio: "Auto",
    });

    const [activeTab, setActiveTab] = React.useState("History");
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [history, setHistory] = React.useState<GeneratedImage[]>(INITIAL_HISTORY);

    // Real API Generation Function
    const handleGenerate = async () => {
        if (!state.prompt.trim()) {
            return; // Could show toast error here "Please enter a prompt"
        }

        setIsGenerating(true);

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(state)
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 402) {
                    toast.error("Generation Failed", {
                        description: data.error,
                        action: {
                            label: "Upgrade to Pro",
                            onClick: () => window.location.href = "/pricing"
                        },
                        duration: 8000,
                    });
                    return; // Prevent further execution
                }
                throw new Error(data.error || "Failed to generate image");
            }

            // Prepend new images to history
            setHistory(prev => [...data.images, ...prev]);

            // Auto switch to history tab if not there
            setActiveTab("History");

            // Reset prompt
            setState(prev => ({ ...prev, prompt: "" }));
            toast.success("Image generated successfully!");

        } catch (error: any) {
            console.error("Generation error:", error);
            toast.error(error.message || "An unexpected error occurred during generation.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="container mx-auto p-6 flex flex-col lg:flex-row gap-8 min-h-screen">

            <GeneratorControls
                state={state}
                setState={setState}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
            />

            <GeneratorHistory
                images={history}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

        </div>
    );
}
