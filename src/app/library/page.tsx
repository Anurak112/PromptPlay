"use client";

import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PromptCard } from "@/components/prompt-card";
import { LibrarySidebar, LibraryFilters } from "@/components/library/library-sidebar";
import { LibraryHeader } from "@/components/library/library-header";
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { InstantSearch, Hits, useInstantSearch } from 'react-instantsearch';
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'dummy_app_id',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY || 'dummy_search_key'
);

// Custom Hits Component to map Algolia hits to our PromptCard
function CustomHits({ onSaveToggle }: { onSaveToggle: (id: string) => void }) {
    const { results, status } = useInstantSearch();

    if (status === 'loading' || status === 'stalled') {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Searching library...</p>
            </div>
        );
    }

    if (!results || results.hits.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-xl font-semibold mb-2">No results found</p>
                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
            {results.hits.map((hit: any) => {
                // Map Algolia Hit structure back to our expected Prompt model
                const prompt = {
                    id: hit.objectID,
                    title: hit.title,
                    fullText: hit.fullText,
                    imageUrl: hit.imageUrl,
                    toolUsed: hit.toolUsed,
                    category: hit.category,
                    tags: hit.tags || [],
                    isPremium: false, // We'd add this to the index later
                    isSaved: false // Local state handled higher up if needed
                };

                return (
                    <PromptCard 
                        key={prompt.id} 
                        prompt={prompt} 
                        onSaveToggle={onSaveToggle}
                    />
                );
            })}
        </div>
    );
}

export default function LibraryPage() {
    const [filters, setFilters] = useState<LibraryFilters>({
        searchQuery: "",
        categories: [],
        tools: [],
        tags: [],
        showSaved: false
    });

    // We keep this purely for UI optimistic states for now
    const handleSaveToggle = (id: string) => {
        // Logic to toggle save in real database will go here in Phase 5
    };

    return (
        <InstantSearch searchClient={searchClient} indexName="prompts">
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
                    />

                    <ScrollArea className="flex-1 p-6 md:p-8">
                        <CustomHits onSaveToggle={handleSaveToggle} />
                    </ScrollArea>
                </main>
            </div>
        </InstantSearch>
    );
}
