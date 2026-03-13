"use client";

import { useState, useMemo, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromptCard } from "@/components/prompt-card";
import { LibrarySidebar, LibraryFilters, CATEGORIES, AI_TOOLS, STYLE_TAGS } from "@/components/library/library-sidebar";
import { LibraryHeader } from "@/components/library/library-header";

// MOCK DATA with extended metadata for filtering
// Fallback empty array instead of mock data
const mockPrompts: any[] = [];

export default function LibraryPage() {
    const [prompts, setPrompts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<LibraryFilters>({
        searchQuery: "",
        categories: [],
        tools: [],
        tags: [],
        showSaved: false
    });

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const res = await fetch("/api/prompts");
                if (res.ok) {
                    const data = await res.json();
                    setPrompts(data.prompts || []);
                }
            } catch (error) {
                console.error("Failed to load prompts", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPrompts();
    }, []);

    // Apply filters locally for the mock data
    const filteredPrompts = useMemo(() => {
        return prompts.filter(prompt => {
            // Text Search
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                const matchesTitle = prompt.title.toLowerCase().includes(query);
                if (!matchesTitle) return false;
            }

            // Saved Filter
            if (filters.showSaved && !prompt.isSaved) {
                return false;
            }

            // Category Filter
            if (filters.categories.length > 0 && !filters.categories.includes(prompt.category)) {
                return false;
            }

            // Tools Filter
            if (filters.tools.length > 0 && !filters.tools.includes(prompt.toolUsed)) {
                return false;
            }

            // Tags Filter (prompt must have at least one of the selected tags, if tags are selected)
            if (filters.tags.length > 0) {
                const hasMatchingTag = prompt.tags.some((t: string) => filters.tags.includes(t));
                if (!hasMatchingTag) return false;
            }

            return true;
        });
    }, [filters]);

    return (
        <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background">

            <LibrarySidebar
                filters={filters}
                setFilters={setFilters}
                className="hidden md:flex"
            />

            <main className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">

                <LibraryHeader
                    filters={filters}
                    setFilters={setFilters}
                    totalResults={filteredPrompts.length}
                />

                <ScrollArea className="flex-1 p-6 md:p-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground">Loading library...</p>
                        </div>
                    ) : filteredPrompts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                            {filteredPrompts.map((prompt) => (
                                <PromptCard 
                                    key={prompt.id} 
                                    prompt={prompt} 
                                    onSaveToggle={(id) => {
                                        setPrompts(prev => prev.map(p => p.id === id ? { ...p, isSaved: !p.isSaved } : p));
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <p className="text-xl font-semibold mb-2">No results found</p>
                            <p className="text-muted-foreground">
                                {prompts.length === 0 
                                    ? "The prompt library is currently empty. Be the first to publish!" 
                                    : "Try adjusting your filters or search query."}
                            </p>
                            {prompts.length > 0 && (
                                <Button
                                    variant="outline"
                                    className="mt-4 border-white/10"
                                    onClick={() => setFilters({ searchQuery: "", categories: [], tools: [], tags: [], showSaved: false })}
                                >
                                    Clear all filters
                                </Button>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </main>

        </div>
    );
}
