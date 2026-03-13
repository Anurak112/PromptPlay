import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">

                {/* Logo */}
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                        <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg shadow-lg shadow-primary/20">
                            <Sparkles className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Aura</span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="/library" className="hover:text-primary transition-colors">Library</Link>
                        <Link href="/library/upload" className="hover:text-primary transition-colors">Upload</Link>
                        <Link href="/create" className="text-primary font-semibold transition-colors flex items-center gap-1">Create ✨</Link>
                        <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
                    </nav>
                </div>

                {/* Global Search Bar (MVP Mock) */}
                <div className="hidden flex-1 items-center justify-center px-8 md:flex max-w-md w-full">
                    <div className="relative w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <Input
                            type="text"
                            placeholder="Search prompts, styles, tags..."
                            className="w-full pl-10 bg-muted/50 border-white/5 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all rounded-full h-10"
                        />
                    </div>
                </div>

                {/* Auth & Actions */}
                {/* Mocked Auth & Actions */}
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/pricing">
                        <Button variant="outline" size="sm" className="hidden sm:flex border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all font-semibold rounded-full px-4">
                            Upgrade to Pro
                        </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="hidden sm:flex hover:bg-white/5 rounded-full px-4">Log in</Button>
                    <Button size="sm" className="rounded-full px-5 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">Sign up</Button>
                </div>

            </div>
        </header>
    );
}
