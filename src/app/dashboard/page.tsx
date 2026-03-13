"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Settings } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
    const isProUser = false; // Mock

    return (
        <div className="container mx-auto px-4 py-12 max-w-7xl min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-12">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Manage your saved inspiration and billing settings.</p>
                </div>
                {!isProUser && (
                    <Link href="/pricing" className="shrink-0">
                        <Button className="rounded-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/20 font-semibold shadow-lg shadow-primary/10">
                            Upgrade to Aura Pro
                        </Button>
                    </Link>
                )}
            </div>

            <div className="glass-card rounded-2xl p-8 max-w-2xl bg-muted/5 border-white/5">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                        <Settings className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Free Tier</h3>
                        <p className="text-sm text-muted-foreground">You are currently on the free explorer plan.</p>
                    </div>
                </div>

                <div className="bg-background/40 rounded-xl p-6 border border-white/10 mb-8 shadow-sm">
                    <h4 className="font-semibold text-lg mb-4 text-white">Upgrade to unlock limits</h4>
                    <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Access to 500+ premium prompts</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Reveal hidden SREF and seed parameters</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Unlimited saves to your Dashboard</li>
                    </ul>
                    <Link href="/pricing" className="block">
                        <Button className="w-full rounded-xl h-12 text-md font-semibold bg-white text-black hover:bg-white/90 shadow-lg">
                            View Pro Plans
                        </Button>
                    </Link>
                </div>

                {/* Mock Stripe Portal Button for Pro users */}
                {isProUser && (
                    <Button variant="outline" className="w-full rounded-xl border-white/10 hover:bg-white/5 h-12">
                        Manage Subscription deeply via Stripe
                    </Button>
                )}
            </div>
        </div>
    );
}
