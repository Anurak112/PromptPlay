import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const data = await req.json();
        
        const { title, fullText, imageUrl, categoryId, toolUsed, tags } = data;

        if (!imageUrl || !fullText || !toolUsed) {
            return NextResponse.json({ error: "Missing required fields for publishing" }, { status: 400 });
        }

        // Fetch a default category or create it if missing
        let finalCategoryId = data.categoryId;
        if (!finalCategoryId) {
            let defaultCat = await prisma.category.findUnique({ where: { slug: "ai-art" } });
            if (!defaultCat) {
                defaultCat = await prisma.category.create({
                    data: {
                        name: "AI Art",
                        slug: "ai-art"
                    }
                });
            }
            finalCategoryId = defaultCat.id;
        }

        // Create the prompt record in DB. 
        const promptRecord = await prisma.prompt.create({
            data: {
                title: title || "Generated Creation",
                fullText,
                imageUrl,
                categoryId: finalCategoryId,
                toolUsed,
                tags: tags && tags.length > 0 ? {
                    connectOrCreate: tags.map((tag: string) => ({
                        where: { name: tag },
                        create: { name: tag }
                    }))
                } : undefined
            }
        });

        return NextResponse.json({ success: true, prompt: promptRecord });

    } catch (error: any) {
        console.error("Publish error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
