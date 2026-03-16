import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useRefinementList, useClearRefinements } from 'react-instantsearch';

export const CATEGORIES = ["Photography", "Illustration", "UI/UX", "3D Renders", "Anime"];
export const AI_TOOLS = [
    "Midjourney v6", 
    "Midjourney niji", 
    "DALL-E 3", 
    "Stable Diffusion XL",
    "Flux Pro 1.1",
    "Flux (Free)",
    "SD 3.5 Large",
    "Nano Banana Pro",
    "Nano Banana 2",
    "Kling 3.0",
    "Turbo (Free)",
    "GPT Image"
];
export const STYLE_TAGS = ["Cinematic", "Neon", "Minimal", "Ghibli", "Isometric", "Macro"];

export interface LibraryFilters {
    searchQuery: string;
    categories: string[];
    tools: string[];
    tags: string[];
    showSaved: boolean;
}

interface LibrarySidebarProps {
    filters: LibraryFilters;
    setFilters: React.Dispatch<React.SetStateAction<LibraryFilters>>;
    className?: string; // To allow appending classes like hidden md:flex
}

// Helper wrapper for Algolia refine lists to match Shadcn UI
function CustomRefinementList({ attribute, title, isTag = false }: { attribute: string, title?: string, isTag?: boolean }) {
    const { items, refine } = useRefinementList({ attribute });

    if (items.length === 0) return null;

    if (isTag) {
        return (
            <div className="space-y-4">
                {title && <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>}
                <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                        <Badge
                            key={item.value}
                            variant="secondary"
                            className={`cursor-pointer transition-colors ${item.isRefined ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                            onClick={(event) => {
                                event.preventDefault();
                                refine(item.value);
                            }}
                        >
                            {item.label} ({item.count})
                        </Badge>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {title && <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>}
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.value} className="flex items-center space-x-3">
                        <Checkbox
                            id={`refine-${attribute}-${item.value}`}
                            className="border-white/20 data-[state=checked]:bg-primary"
                            checked={item.isRefined}
                            onCheckedChange={() => refine(item.value)}
                        />
                        <Label 
                            htmlFor={`refine-${attribute}-${item.value}`} 
                            className="text-sm font-normal cursor-pointer hover:text-white transition-colors flex w-full justify-between"
                        >
                            <span>{item.label}</span>
                            <span className="text-muted-foreground text-xs">{item.count}</span>
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function LibrarySidebar({ filters, setFilters, className = "" }: LibrarySidebarProps) {
    const { canRefine, refine: clearAll } = useClearRefinements();

    return (
        <aside className={`flex flex-col w-72 border-r border-white/10 glass z-10 ${className}`}>
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" /> Filters
                </h2>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground hover:text-white"
                    onClick={() => clearAll()}
                    disabled={!canRefine}
                >
                    Clear All
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">
                    {/* Saved Prompts Toggle - Kept local for Phase 5 */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer" onClick={() => setFilters(prev => ({ ...prev, showSaved: !prev.showSaved }))}>
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-colors ${filters.showSaved ? "bg-red-500/20 text-red-500" : "bg-white/10 text-muted-foreground"}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filters.showSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-white">Saved Prompts</h3>
                                    <p className="text-xs text-muted-foreground">Show your liked prompts</p>
                                </div>
                            </div>
                            <Checkbox 
                                id="show-saved" 
                                className="border-white/20 data-[state=checked]:bg-primary"
                                checked={filters.showSaved}
                                onCheckedChange={(checked) => setFilters(prev => ({ ...prev, showSaved: checked === true }))}
                            />
                        </div>
                    </div>

                    <CustomRefinementList attribute="category" title="Categories" />
                    <CustomRefinementList attribute="toolUsed" title="AI Tool" />
                    <CustomRefinementList attribute="tags" title="Style Tags" isTag={true} />
                </div>
            </ScrollArea>
        </aside>
    );
}
