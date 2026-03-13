"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface GeneratedImage {
    id: string | number;
    height: string;
    src: string;
    prompt?: string;
    model?: string;
}

interface GeneratorHistoryProps {
    images: GeneratedImage[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const handlePublish = async (img: GeneratedImage) => {
    try {
        const res = await fetch("/api/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: img.prompt ? img.prompt.substring(0, 40) + "..." : "Generated Image",
                fullText: img.prompt || "No prompt provided",
                imageUrl: img.src,
                toolUsed: img.model || "Unknown Tool",
                tags: ["AI Generated"]
            })
        });

        if (!res.ok) throw new Error("Failed to publish");
        
        toast.success("Successfully published to Library!");
    } catch (error: any) {
        toast.error(error.message || "Failed to publish image");
    }
};

const TABS = ["History", "Prompt Library", "My like"];

export function GeneratorHistory({ images, activeTab, setActiveTab }: GeneratorHistoryProps) {
    return (
        <div className="flex-1 flex flex-col min-w-0">
            {/* Tabs */}
            <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors ${activeTab === tab
                            ? "bg-foreground text-background"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Masonry Grid */}
            {activeTab === "History" && (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {images.length === 0 && (
                        <div className="col-span-full h-64 flex items-center justify-center text-muted-foreground border border-dashed border-white/10 rounded-2xl bg-white/5">
                            No history yet. Start generating!
                        </div>
                    )}
                    {images.map((img) => (
                        <div key={img.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border border-border/50">
                            {/* Using typical img tag for masonry layout compatibility */}
                            <img
                                src={img.src + "?auto=format&fit=crop&q=80&w=600"}
                                alt={img.prompt || "Generated image"}
                                className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${img.height}`}
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                {img.model && (
                                    <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium text-white shadow-lg">
                                        {img.model}
                                    </span>
                                )}
                                <div className="flex flex-col gap-2 mt-auto">
                                    <Button size="sm" variant="secondary" className="w-full font-semibold backdrop-blur-md bg-white/20 text-white border-0 hover:bg-white/30">
                                        View Details
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        className="w-full font-semibold backdrop-blur-md bg-primary/80 text-white border-0 hover:bg-primary shadow-lg"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePublish(img);
                                        }}
                                    >
                                        Share to Library
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab !== "History" && (
                <div className="h-64 flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/10 rounded-2xl bg-white/5">
                    <p className="text-muted-foreground text-lg mb-2">This tab is currently empty in mock mode.</p>
                    <Button variant="outline" onClick={() => setActiveTab("History")}>Back to History</Button>
                </div>
            )}
        </div>
    );
}
