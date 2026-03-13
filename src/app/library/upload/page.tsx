"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { CATEGORIES, AI_TOOLS, STYLE_TAGS } from "@/components/library/library-sidebar";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function UploadPromptPage() {
    const [title, setTitle] = useState("");
    const [fullText, setFullText] = useState("");
    const [categoryId, setCategoryId] = useState(""); // We will match categories by Name directly for now, or find the actual ID if needed, wait we need actual DB Category ID usually.
    // wait, our schema: category is a relation. Let's send the category NAME string and have the backend handle findOrCreate, OR we can fetch categories first. 
    // Let's use the hardcoded CATEGORIES array for now mapping to strings, but we should make sure the API route can find it by `slug` or `name`.
    // Actually, I'll update the frontend to pass the category string, and the backend needs to connect or create the category.
    const [selectedCategory, setSelectedCategory] = useState("");
    const [toolUsed, setToolUsed] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            setPreviewUrl(URL.createObjectURL(selected));
        }
    };

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!file || !title || !fullText || !selectedCategory || !toolUsed) {
            toast.error("Please fill all required fields and upload an image.");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("title", title);
            formData.append("fullText", fullText);
            formData.append("categoryName", selectedCategory); // We'll update the API to handle the name -> connectOrCreate
            formData.append("toolUsed", toolUsed);
            formData.append("tags", selectedTags.join(","));

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to upload");
            }

            toast.success("Prompt published to the library!");
            
            // Reset form
            setTitle("");
            setFullText("");
            setSelectedCategory("");
            setToolUsed("");
            setSelectedTags([]);
            setFile(null);
            setPreviewUrl(null);

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl min-h-[calc(100vh-4rem)]">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold tracking-tight mb-3">Publish to Library</h1>
                <p className="text-muted-foreground text-lg">Curate and share breathtaking AI generations with the community.</p>
            </div>

            <div className="glass-card rounded-3xl p-8 lg:p-12 border border-white/10 shadow-2xl relative overflow-hidden bg-background/50 backdrop-blur-xl">
                {/* Decorative background gradients */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <form onSubmit={handleSubmit} className="relative z-10 flex flex-col md:flex-row gap-12">
                    
                    {/* Left: Image Upload Area */}
                    <div className="w-full md:w-5/12 flex flex-col gap-4">
                        <Label className="text-lg font-semibold">Reference Image *</Label>
                        <div className="relative aspect-[4/5] rounded-2xl border-2 border-dashed border-white/20 hover:border-primary/50 transition-colors bg-white/5 group overflow-hidden flex flex-col items-center justify-center cursor-pointer">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                            />
                            
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover z-10" />
                            ) : (
                                <div className="text-center p-6 flex flex-col items-center z-10 pointer-events-none">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                                        <UploadCloud className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </div>
                                    <h4 className="font-medium text-white mb-2">Click or drag image</h4>
                                    <p className="text-xs text-muted-foreground">High quality PNG or JPG</p>
                                </div>
                            )}

                            {/* Edit Overlay */}
                            {previewUrl && (
                                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center pointer-events-none">
                                    <span className="bg-background/80 px-4 py-2 rounded-full text-sm font-medium border border-white/10 backdrop-blur-md">Change Image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Prompt Details Form */}
                    <div className="w-full md:w-7/12 flex flex-col gap-6">
                        
                        <div className="space-y-3">
                            <Label htmlFor="title" className="text-sm font-medium text-muted-foreground">Title *</Label>
                            <Input 
                                id="title" 
                                placeholder="e.g. Ethereal Cyberpunk Cityscape" 
                                className="h-12 bg-white/5 border-white/10 focus-visible:ring-primary rounded-xl"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="fullText" className="text-sm font-medium text-muted-foreground">Full Prompt *</Label>
                            <Textarea 
                                id="fullText" 
                                placeholder="A cinematic wide shot of a glowing neon city..." 
                                className="min-h-[120px] bg-white/5 border-white/10 focus-visible:ring-primary rounded-xl resize-y"
                                value={fullText}
                                onChange={e => setFullText(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-muted-foreground">Category *</Label>
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-medium text-muted-foreground">AI Tool / Model *</Label>
                                <Select value={toolUsed} onValueChange={setToolUsed}>
                                    <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl">
                                        <SelectValue placeholder="Select Model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {AI_TOOLS.map(tool => (
                                            <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
                            <Label className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                Style Tags
                                <span className="text-xs font-normal opacity-50">Optional</span>
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {STYLE_TAGS.map(tag => {
                                    const isActive = selectedTags.includes(tag);
                                    return (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className={`cursor-pointer transition-colors px-3 py-1 ${isActive ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-white/5 border-white/10 hover:bg-white/10 text-muted-foreground'}`}
                                            onClick={() => handleTagToggle(tag)}
                                        >
                                            {tag}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="pt-6 mt-auto">
                            <Button 
                                type="submit" 
                                className="w-full h-14 rounded-xl text-md font-semibold shadow-lg shadow-primary/20"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                        Publishing to Library...
                                    </>
                                ) : (
                                    "Publish Prompt"
                                )}
                            </Button>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}
