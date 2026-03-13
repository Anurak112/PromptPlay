import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, Zap, Image as ImageIcon, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
        <div className="container relative mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-6 rounded-full px-4 py-1.5 border-primary/20 bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Sparkles className="w-4 h-4 mr-2" />
            Introducing Aura Pro
          </Badge>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-8 bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/40">
            The Ultimate AI Creative Intelligence Platform
          </h1>

          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            Unlock the world's most beautiful and precise AI prompts, style references, and generation parameters to elevate your creative workflow instantly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/library">
              <Button size="lg" className="rounded-full px-8 h-12 text-md font-semibold shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all">
                Browse Library
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-md font-semibold border-white/10 hover:bg-white/5 transition-all">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Grid Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Trending Styles</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Discover the latest Midjourney, DALL-E, and Stable Diffusion prompts curated by top creators.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Mock Featured Cards */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="glass-card group relative rounded-2xl overflow-hidden aspect-[4/5] bg-muted/20">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 z-0">
                  <ImageIcon className="w-12 h-12" />
                </div>
                {/* Fallback mock gradient until images are seeded */}
                <div className={`absolute inset-0 opacity-80 mix-blend-overlay ${['bg-gradient-to-tr from-purple-500 to-indigo-500', 'bg-gradient-to-br from-emerald-500 to-teal-500', 'bg-gradient-to-t from-pink-500 to-rose-500', 'bg-gradient-to-bl from-blue-500 to-cyan-500'][i % 4]}`} />

                <div className="relative z-10 w-full h-full flex flex-col justify-end p-5 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {i % 3 === 0 && (
                    <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-lg backdrop-blur-md">
                      <Lock className="w-3 h-3 mr-1" /> Pro
                    </Badge>
                  )}
                  <h3 className="font-semibold text-white mb-1 truncate">Cinematic Cyberpunk Port...</h3>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <span className="bg-white/20 px-2 py-0.5 rounded-sm backdrop-blur-md">Midjourney v6</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button variant="ghost" className="rounded-full group hover:bg-white/5">
              View all 500+ styles
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]" />

        <div className="container relative mx-auto px-4 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Unlock the full power of Aura to supercharge your AI generations.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Free Tier */}
            <div className="glass-card rounded-3xl p-8 flex flex-col">
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">Free Explorer</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-sm text-muted-foreground">/ forever</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-muted-foreground">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary/50" /> Browse entire visual gallery</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary/50" /> Search by tags and categories</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-primary/50" /> Access 50+ free starter prompts</li>
              </ul>
              <Button variant="outline" className="w-full rounded-xl h-12 border-white/10 hover:bg-white/5">
                Get Started
              </Button>
            </div>

            {/* Pro Tier */}
            <div className="glass-card rounded-3xl p-8 flex flex-col relative border-primary/50 shadow-2xl shadow-primary/20 bg-primary/5">
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <Badge className="bg-primary text-primary-foreground text-xs py-1 px-3 shadow-lg">Most Popular</Badge>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Aura Pro</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-bold text-white">$12</span>
                <span className="text-sm text-muted-foreground">/ month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-white/80">
                <li className="flex gap-3"><Zap className="w-5 h-5 text-primary" /> Unlock all 500+ premium prompts</li>
                <li className="flex gap-3"><Zap className="w-5 h-5 text-primary" /> Reveal hidden SREF codes & seeds</li>
                <li className="flex gap-3"><Zap className="w-5 h-5 text-primary" /> Save & bookmark unlimited prompts</li>
                <li className="flex gap-3"><Zap className="w-5 h-5 text-primary" /> Early access to weekly new drops</li>
              </ul>
              <Button className="w-full rounded-xl h-12 shadow-lg hover:shadow-primary/50 hover:scale-[1.02] transition-all font-semibold">
                Upgrade to Pro
              </Button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
