import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { algoliasearch } from "algoliasearch";

// Initialize Algolia client
const algoliaClient = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID && process.env.ALGOLIA_ADMIN_KEY
    ? algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID, process.env.ALGOLIA_ADMIN_KEY)
    : null;

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
            },
            include: {
                tags: true,
                category: true,
            }
        });

        // Index the new prompt into Algolia
        if (algoliaClient) {
            try {
                // Format the record for Algolia
                const algoliaRecord = {
                    objectID: promptRecord.id,
                    title: promptRecord.title,
                    fullText: promptRecord.fullText,
                    imageUrl: promptRecord.imageUrl,
                    toolUsed: promptRecord.toolUsed,
                    category: promptRecord.category.name,
                    tags: promptRecord.tags.map(t => t.name),
                    createdAt: promptRecord.createdAt.getTime()
                };

                await algoliaClient.saveObject({ 
                    indexName: "prompts", 
                    body: algoliaRecord 
                });
                console.log("Successfully indexed prompt to Algolia:", promptRecord.id);
            } catch (algoliaError) {
                console.error("Failed to index to Algolia:", algoliaError);
                // We don't fail the whole request if search indexing fails temporarily
            }
        } else {
            console.warn("Skipping Algolia indexing: Missing API credentials in environment.");
        }

        return NextResponse.json({ success: true, prompt: promptRecord });

    } catch (error: any) {
        console.error("Publish error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
