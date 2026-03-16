import { prisma } from "./prisma";

const DAILY_FREE_CREDITS = 5;

/**
 * Checks if a user has enough credits to perform an action.
 * Handles daily credit resets automatically.
 */
export async function checkCredits(userId: string): Promise<{ hasCredits: boolean; currentCredits: number }> {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        // If user not found in DB, return 0 credits (they can't generate)
        return { hasCredits: false, currentCredits: 0 };
    }

    // Unlimited for PRO users
    if (user.role === 'PRO_USER') {
        return { hasCredits: true, currentCredits: Infinity };
    }

    // Check if we need to reset daily credits
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastReset = new Date(user.lastCreditReset);
    lastReset.setHours(0, 0, 0, 0);

    if (lastReset < today) {
        // It's a new day, reset their credits
        const resetUser = await prisma.user.update({
            where: { id: userId },
            data: {
                credits: DAILY_FREE_CREDITS,
                lastCreditReset: new Date()
            }
        });
        
        return {
            hasCredits: resetUser.credits > 0,
            currentCredits: resetUser.credits
        };
    }

    return {
        hasCredits: user.credits > 0,
        currentCredits: user.credits
    };
}

/**
 * Deducts 1 credit from the user's account.
 * Pro users are exempt.
 */
export async function deductCredit(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user || user.role === 'PRO_USER') {
        return;
    }

    // Ensure we don't go below 0
    if (user.credits > 0) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                credits: { decrement: 1 }
            }
        });
    }
}
