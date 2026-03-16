import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummy", {
    apiVersion: "2023-10-16" as any, // Using a stable recent version or default
});

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || !user.stripeCustomerId) {
            // User doesn't have a Stripe customer ID, so they don't have an active or past subscription to manage
            return new NextResponse("No active subscription found", { status: 400 });
        }

        // Generate the Stripe Customer Portal session
        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
        });

        return NextResponse.json({ url: stripeSession.url });

    } catch (error) {
        console.error("Stripe portal error:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
