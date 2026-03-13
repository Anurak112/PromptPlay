import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-background/50 py-12 mt-auto">
            <div className="container mx-auto px-4 md:px-8 grid gap-8 md:grid-cols-4">

                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-md">
                            <Sparkles className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">Aura</span>
                    </Link>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        The ultimate creative intelligence platform. High-performance prompt database and style references.
                    </p>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Platform</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><Link href="/library" className="hover:text-primary transition-colors">Library</Link></li>
                        <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
                        <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><a href="#" className="hover:text-primary transition-colors">API Documentation</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Community Discord</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-primary transition-colors">Refund Policy</a></li>
                    </ul>
                </div>

            </div>
            <div className="container mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-white/5 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Aura Platform. All rights reserved.
            </div>
        </footer>
    );
}
