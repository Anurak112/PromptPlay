import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Lock, Image as ImageIcon, Check } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface PromptCardProps {
    prompt: {
        id: string;
        title: string;
        imageUrl: string;
        fullText?: string;
        toolUsed?: string;
        isSaved?: boolean;
        isPremium?: boolean;
    };
    onSaveToggle?: (id: string) => void;
    actionButton?: React.ReactNode;
}

export function PromptCard({ prompt, actionButton, onSaveToggle }: PromptCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (prompt.fullText) {
            navigator.clipboard.writeText(prompt.fullText);
            setCopied(true);
            toast.success("Prompt copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } else {
             // Fallback to title if fullText is somehow missing
            navigator.clipboard.writeText(prompt.title);
            setCopied(true);
            toast.success("Title copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="group relative rounded-2xl overflow-hidden glass-card aspect-[4/5] bg-muted/20 flex flex-col justify-end">
            {/* Background Image Setup */}
            {prompt.imageUrl ? (
                <Image
                    src={prompt.imageUrl}
                    alt={prompt.title}
                    fill
                    className="object-cover z-0 transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 z-0">
                    <ImageIcon className="w-12 h-12" />
                </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/95 via-background/60 to-background/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Badges */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 pointer-events-none">
                {prompt.isPremium && (
                    <Badge className="bg-primary hover:bg-primary text-primary-foreground shadow-lg backdrop-blur-md">
                        <Lock className="w-3 h-3 mr-1" /> Pro
                    </Badge>
                )}
            </div>

            {/* Content */}
            <div className="relative z-20 w-full p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-3">
                <h3 className="font-semibold text-white line-clamp-1">{prompt.title}</h3>
                
                {prompt.fullText && (
                    <p className="text-xs text-white/80 line-clamp-3 leading-relaxed hidden group-hover:block mb-2">
                        {prompt.fullText}
                    </p>
                )}

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-xs text-white/70">
                        {prompt.toolUsed && (
                            <span className="bg-white/20 px-2 py-0.5 rounded-sm backdrop-blur-md">{prompt.toolUsed}</span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {actionButton}
                        {prompt.isSaved !== undefined && (
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                className={`h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors ${prompt.isSaved ? "text-red-500 hover:text-red-400" : "text-white"}`} 
                                title={prompt.isSaved ? "Unsave Prompt" : "Save Prompt"}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (onSaveToggle) onSaveToggle(prompt.id);
                                }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={prompt.isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                <span className="sr-only">Save</span>
                            </Button>
                        )}
                        <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-colors" 
                            title="Copy Prompt"
                            onClick={handleCopy}
                        >
                            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            <span className="sr-only">Copy</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
