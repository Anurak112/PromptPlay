import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: true,
                subscriptionStatus: true,
                credits: true,
                stripeCustomerId: true, 
            }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        return NextResponse.json({
            role: user.role,
            subscriptionStatus: user.subscriptionStatus,
            credits: user.credits,
            hasStripeCustomer: !!user.stripeCustomerId
        });

    } catch (error) {
        console.error("Profile fetch error:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
