'use client';

import { useState, useEffect } from 'react';
import { useAutoSave } from '@/lib/hooks/useAutoSave';
import { createClient } from '@/lib/supabase/client';
import BlogEditor from '@/components/editor/BlogEditor';
import type { JSONContent } from 'novel';

export default function BlogWritePage() {
    const supabase = createClient();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState<JSONContent | undefined>(undefined);
    const [slug, setSlug] = useState('');
    const [generatingSlug, setGeneratingSlug] = useState(false);
    const [postId, setPostId] = useState<string | null>(null);

    // Auto Save Hook
    const { saveStatus, lastSaved, triggerSave } = useAutoSave({
        docId: postId || 'draft',
        debounceMs: 2000,
        onSave: async (savedContent, savedTitle) => {
            // Mock Save: just log to console
            console.log('[AutoSave] Saving content:', { title: savedTitle, content: savedContent });
            await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network

            // Mimic creating a post ID if not exists
            if (!postId) {
                setPostId('mock-post-uuid-1234');
            }
        },
    });

    // Slug Generation
    useEffect(() => {
        if (!title || title.trim().length === 0) {
            return;
        }

        const timeoutId = setTimeout(async () => {
            if (slug && slug.trim().length > 0) {
                return;
            }

            setGeneratingSlug(true);
            try {
                const response = await fetch('/api/blog/generate-slug', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title }),
                });

                if (!response.ok) throw new Error('Failed to generate slug');

                const data = await response.json();
                if (data.slug) {
                    setSlug(data.slug);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setGeneratingSlug(false);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [title, slug]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (content) {
            triggerSave(content, newTitle);
        }
    };

    const handleContentChange = (newContent: JSONContent) => {
        setContent(newContent);
        triggerSave(newContent, title);
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Write a Post</h1>
                {/* Save Status */}
                <div className="flex items-center gap-2 text-xs">
                    {saveStatus === 'saving' && (
                        <span className="text-yellow-600 dark:text-yellow-400">Saving...</span>
                    )}
                    {saveStatus === 'saved' && lastSaved && (
                        <span className="text-green-600 dark:text-green-400">
                            Saved {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-red-600">Save Failed</span>
                    )}
                    {saveStatus === 'offline' && (
                        <span className="text-slate-600">Offline</span>
                    )}
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <input
                    type="text"
                    placeholder="Post Title"
                    value={title}
                    onChange={handleTitleChange}
                    className="w-full text-4xl font-bold border-none outline-none bg-transparent placeholder:text-slate-300 dark:placeholder:text-slate-700"
                />
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Slug:</span>
                    <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="auto-generated-slug"
                        className="bg-transparent border-b border-dashed border-slate-300 outline-none flex-1"
                    />
                    {generatingSlug && <span className="animate-pulse">Generating...</span>}
                </div>
            </div>

            <BlogEditor
                content={content}
                onChange={handleContentChange}
            />
        </div>
    );
}
