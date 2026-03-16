"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [profile, setProfile] = useState<{ role: string; credits: number; subscriptionStatus: string; hasStripeCustomer: boolean } | null>(null);
    const [isManaging, setIsManaging] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/user/profile");
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleManageSubscription = async () => {
        setIsManaging(true);
        try {
            const res = await fetch("/api/stripe/portal", { method: "POST" });
            const data = await res.json();
            
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error("Failed to load billing portal");
            }
        } catch (error) {
            toast.error("An error occurred opening the billing portal");
        } finally {
            setIsManaging(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-24 flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const isProUser = profile?.role === "PRO_USER";

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
                        {isProUser ? <CreditCard className="w-7 h-7 text-primary" /> : <Settings className="w-7 h-7 text-primary" />}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{isProUser ? "Aura Pro" : "Free Tier"}</h3>
                        <p className="text-sm text-muted-foreground">
                            {isProUser 
                                ? `You are currently on the Pro plan (${profile?.subscriptionStatus}).` 
                                : `You are currently on the free explorer plan. Credits remaining: ${profile?.credits || 0}`
                            }
                        </p>
                    </div>
                </div>

                {!isProUser && (
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
                )}

                {/* Stripe Portal Button for Pro users or those who have had a subscription */}
                {profile?.hasStripeCustomer && (
                    <Button 
                        variant="outline" 
                        onClick={handleManageSubscription}
                        disabled={isManaging}
                        className="w-full rounded-xl border-white/10 hover:bg-white/5 h-12"
                    >
                        {isManaging ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                        Manage Subscription
                    </Button>
                )}
            </div>
        </div>
    );
}
