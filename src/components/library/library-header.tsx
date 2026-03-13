import * as React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { LibrarySidebar, LibraryFilters } from "./library-sidebar";

interface LibraryHeaderProps {
    filters: LibraryFilters;
    setFilters: React.Dispatch<React.SetStateAction<LibraryFilters>>;
    totalResults: number;
}

export function LibraryHeader({ filters, setFilters, totalResults }: LibraryHeaderProps) {
    return (
        <header className="p-6 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between z-10 bg-background/50 backdrop-blur-sm">
            <div className="relative w-full max-w-xl group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <Input
                    type="text"
                    placeholder="Search by prompt, style, or creative keyword..."
                    className="w-full pl-12 h-14 bg-card/60 backdrop-blur-md border-white/10 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-lg transition-all rounded-full shadow-lg"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                />
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground whitespace-nowrap">
                <span>Showing <strong className="text-white">{totalResults}</strong> results</span>

                {/* Mobile Filter Toggle */}
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="md:hidden border-white/10 rounded-full bg-white/5">
                            <SlidersHorizontal className="w-4 h-4 mr-2" /> Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r-white/10 bg-background/95 backdrop-blur-xl w-[300px]">
                        <SheetTitle className="sr-only">Filters</SheetTitle>
                        <LibrarySidebar filters={filters} setFilters={setFilters} className="w-full border-none h-full bg-transparent" />
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
