"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Heart, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PromptPage({ params }: { params: { id: string } }) {
    const [isSaved, setIsSaved] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    // In a real app, we'd fetch the user's subscription status from the DB here
    const userId = "mock_user_123";
    const isProUser = false; // Mocking a free tier user to demonstrate gating

    // Mock Prompt Data
    const prompt = {
        id: params.id,
        title: "Cinematic Cyberpunk Portrait of a Neon Samurai",
        fullText: "A highly detailed, cinematic cyberpunk portrait of a futuristic neon samurai standing in the rain. Volumetric lighting, mist, 8k resolution, photorealistic, shot on 35mm lens --ar 16:9 --v 6.0 --s 250 --style raw",
        srefCode: "--sref 1839294",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop", // placeholder
        isPremium: true,
        toolUsed: "Midjourney v6",
        author: "Aura Admins"
    };

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
            <Link href="/library" className="text-sm text-muted-foreground hover:text-white mb-8 inline-block transition-colors">
                &larr; Back to Library
            </Link>

            <div className="grid md:grid-cols-2 gap-12 items-start">

                {/* Left Col: Image */}
                <div className="relative aspect-[4/5] md:aspect-square w-full rounded-2xl overflow-hidden glass shadow-2xl bg-muted/20">
                    <Image
                        src={prompt.imageUrl}
                        alt={prompt.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Right Col: Details */}
                <div className="flex flex-col gap-8">

                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Badge variant="outline" className="border-white/10">{prompt.toolUsed}</Badge>
                            {prompt.isPremium && (
                                <Badge className="bg-primary/20 text-primary border-primary/20">Premium Prompt</Badge>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{prompt.title}</h1>
                        <p className="text-muted-foreground flex items-center gap-2">
                            Curated by <strong className="text-white">{prompt.author}</strong>
                        </p>
                    </div>

                    {/* Prompt Text Box */}
                    <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                Prompt Details
                            </h3>
                            {(isProUser || !prompt.isPremium) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 group-hover:bg-white/10 hover:bg-white/20"
                                    onClick={() => {
                                        navigator.clipboard.writeText(prompt.fullText);
                                        setIsCopied(true);
                                        setTimeout(() => setIsCopied(false), 2000);
                                    }}
                                >
                                    {isCopied ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> : <Copy className="w-4 h-4 mr-2" />}
                                    {isCopied ? "Copied!" : "Copy"}
                                </Button>
                            )}
                        </div>

                        <div className="relative">
                            <p className={`text-muted-foreground leading-relaxed ${(!isProUser && prompt.isPremium) ? 'blur-sm select-none' : ''}`}>
                                {prompt.fullText}
                            </p>
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className={`font-mono text-sm text-primary ${(!isProUser && prompt.isPremium) ? 'blur-sm select-none' : ''}`}>
                                    Style Ref: {prompt.srefCode}
                                </p>
                            </div>

                            {/* Premium Gate Overlay */}
                            {!isProUser && prompt.isPremium && (
                                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-background/40 backdrop-blur-[2px] rounded-lg">
                                    <Lock className="w-8 h-8 text-primary mb-3" />
                                    <h4 className="font-bold text-lg mb-2">Pro Content</h4>
                                    <p className="text-sm text-white/80 mb-6 max-w-xs">
                                        Upgrade to Aura Pro to unlock this full prompt, copy parameters, and view style tokens.
                                    </p>
                                    <Link href="/pricing">
                                        <Button className="rounded-full shadow-lg hover:shadow-primary/50 transition-all font-semibold">
                                            Unlock with Pro - $12/mo
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Row */}
                    <div className="flex items-center gap-4 pt-4">
                        <Button
                            size="lg"
                            className={`flex-1 rounded-full text-md font-semibold h-14 border transition-colors ${isSaved
                                    ? 'bg-primary/20 text-primary border-primary/50 hover:bg-primary/30'
                                    : 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                                }`}
                            onClick={() => setIsSaved(!isSaved)}
                        >
                            <Heart className={`w-5 h-5 mr-3 transition-colors ${isSaved ? 'fill-primary text-primary' : ''}`} />
                            {isSaved ? "Saved to Bookmarks" : "Save to Bookmarks"}
                        </Button>
                    </div>

                    <div className="bg-primary/5 rounded-xl p-4 flex items-start gap-4 border border-primary/20 text-sm">
                        <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-white/80">Using specific style references (`--sref`) is strictly applicable to Midjourney and might not translate to other models accurately.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
