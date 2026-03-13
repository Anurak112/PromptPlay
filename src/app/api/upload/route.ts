import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { put } from "@vercel/blob";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        
        const file = formData.get("image") as File | null;
        const title = formData.get("title") as string;
        const fullText = formData.get("fullText") as string;
        const categoryName = formData.get("categoryName") as string;
        const toolUsed = formData.get("toolUsed") as string;
        
        // Tags might come as a comma separated string
        const tagsString = formData.get("tags") as string;
        const tags = tagsString ? tagsString.split(",").map(t => t.trim()) : [];

        if (!file || !title || !fullText || !categoryName || !toolUsed) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Find or create Category
        let category = await prisma.category.findUnique({ where: { name: categoryName } });
        if (!category) {
            const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            category = await prisma.category.create({
                data: { name: categoryName, slug: slug }
            });
        }

        // Upload file to Vercel Blob
        const fileExtension = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExtension}`;
        
        const blob = await put(`uploads/${fileName}`, file, {
            access: 'public',
        });
        
        const imageUrl = blob.url;

        // Create the prompt record in DB
        // For tags, we either connect or create them
        const promptRecord = await prisma.prompt.create({
            data: {
                title,
                fullText,
                imageUrl,
                categoryId: category.id,
                toolUsed,
                tags: {
                    connectOrCreate: tags.map(tag => ({
                        where: { name: tag },
                        create: { name: tag }
                    }))
                }
            }
        });

        return NextResponse.json({ success: true, prompt: promptRecord });

    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error", details: error.toString() }, { status: 500 });
    }
}
