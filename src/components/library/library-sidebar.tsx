import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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

export function LibrarySidebar({ filters, setFilters, className = "" }: LibrarySidebarProps) {
    const handleCategoryChange = (category: string, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            categories: checked
                ? [...prev.categories, category]
                : prev.categories.filter(c => c !== category)
        }));
    };

    const handleToolChange = (tool: string, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            tools: checked
                ? [...prev.tools, tool]
                : prev.tools.filter(t => t !== tool)
        }));
    };

    const handleTagToggle = (tag: string) => {
        setFilters(prev => {
            const isActive = prev.tags.includes(tag);
            return {
                ...prev,
                tags: isActive
                    ? prev.tags.filter(t => t !== tag)
                    : [...prev.tags, tag]
            };
        });
    };

    const clearAll = () => {
        setFilters(prev => ({ ...prev, categories: [], tools: [], tags: [], showSaved: false }));
    };

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
                    onClick={clearAll}
                >
                    Clear All
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">

                    {/* Saved Prompts Toggle */}
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

                    {/* Category Filter */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Categories</h3>
                        <div className="space-y-3">
                            {CATEGORIES.map(cat => (
                                <div key={cat} className="flex items-center space-x-3">
                                    <Checkbox
                                        id={`cat-${cat}`}
                                        className="border-white/20 data-[state=checked]:bg-primary"
                                        checked={filters.categories.includes(cat)}
                                        onCheckedChange={(checked) => handleCategoryChange(cat, checked === true)}
                                    />
                                    <Label htmlFor={`cat-${cat}`} className="text-sm font-normal cursor-pointer hover:text-white transition-colors">{cat}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Tool Filter */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">AI Tool</h3>
                        <div className="space-y-3">
                            {AI_TOOLS.map(tool => (
                                <div key={tool} className="flex items-center space-x-3">
                                    <Checkbox
                                        id={`tool-${tool}`}
                                        className="border-white/20 data-[state=checked]:bg-primary"
                                        checked={filters.tools.includes(tool)}
                                        onCheckedChange={(checked) => handleToolChange(tool, checked === true)}
                                    />
                                    <Label htmlFor={`tool-${tool}`} className="text-sm font-normal cursor-pointer hover:text-white transition-colors">{tool}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Style Tags */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Style Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {STYLE_TAGS.map(tag => {
                                const isActive = filters.tags.includes(tag);
                                return (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className={`cursor-pointer transition-colors ${isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                                        onClick={() => handleTagToggle(tag)}
                                    >
                                        {tag}
                                    </Badge>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </ScrollArea>
        </aside>
    );
}
