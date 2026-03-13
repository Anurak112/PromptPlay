import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const prompts = await prisma.prompt.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                tags: true,
                category: true,
            }
        });

        // Format for frontend
        const formattedPrompts = prompts.map(p => ({
            id: p.id,
            title: p.title,
            fullText: p.fullText,
            imageUrl: p.imageUrl,
            isPremium: p.isPremium,
            toolUsed: p.toolUsed,
            category: p.category?.name || "Uncategorized", // Fallback for safety
            tags: p.tags.map(t => t.name),
            isSaved: false // We will need user relation for real saved states later
        }));

        return NextResponse.json({ prompts: formattedPrompts });
    } catch (error) {
        console.error("Failed to fetch prompts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
