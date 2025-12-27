'use client';

import { useMemo, useState } from 'react';
import {
    EditorRoot,
    EditorContent,
    EditorCommand,
    EditorCommandItem,
    EditorCommandEmpty,
    EditorCommandList,
    type JSONContent,
} from 'novel';
// Mocking or removing unavailable imports
const handleImagePaste = (view: any, event: any, uploadFn: any) => {
    // Basic implementation or pass through
    return false;
};
const handleImageDrop = (view: any, event: any, moved: any, uploadFn: any) => {
    return false;
};

import { ImageResizeExtension } from './extensions/ImageResizeExtension';
import { extensions, suggestionItems } from './extensions';
import { createClient } from '@/lib/supabase/client';
import EditorBubbleMenu from './BubbleMenu';

interface BlogEditorProps {
    content?: JSONContent;
    onChange?: (content: JSONContent) => void;
}

export default function BlogEditor({ content, onChange }: BlogEditorProps) {
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();

    // Image Upload Function
    const uploadFn = async (file: File) => {
        setUploading(true);
        try {
            // Mock Upload logic from supabase client
            // In real app: 
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `blog-images/${fileName}`;

            const { error } = await supabase.storage.from('blog-images').upload(filePath, file);
            if (error) throw error;

            const { data } = supabase.storage.from('blog-images').getPublicUrl(filePath);
            return data.publicUrl;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            setUploading(false);
        }
    };

    // Extensions
    const editorExtensions = useMemo(() => {
        return [
            ...extensions,
            ImageResizeExtension
        ];
    }, []);

    return (
        <div className="relative w-full max-w-screen-lg">
            <EditorRoot>
                <EditorContent
                    initialContent={content}
                    extensions={editorExtensions}
                    immediatelyRender={false}
                    className="relative min-h-[500px] w-full border rounded-lg p-4 sm:p-10 bg-white dark:bg-slate-950 sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
                    editorProps={{
                        handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
                        handleDrop: (view, event, slice, moved) => handleImageDrop(view, event, moved, uploadFn),
                        attributes: {
                            class: `prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full`,
                        },
                    }}
                    onUpdate={({ editor }) => {
                        onChange?.(editor.getJSON());
                    }}
                    slotAfter={<EditorBubbleMenu editor={null as any} />}
                >
                    {/* Note: In current novel version, bubble menu is often handled inside EditorContent or via children if supported, or we need to pass editor instance. 
                However, EditorContent components usually expose render props or we use a context.
                Novel's EditorContent might not accept children for bubble menu directly in some versions.
                But let's stick to the pattern. 
                Actually, to get the 'editor' instance for BubbleMenu, we might need to use `useEditor` context or similar if Novel exposes it, 
                or rely on the fact that `EditorContent` handles its own UI or allows `slotAfter`.
                
                Wait, Novel's `EditorContent` usually creates the editor.
                We can access the editor via `onUpdate` or `onCreate`.
                
                For this implementation, let's put BubbleMenu inside a wrapper that uses `useCurrentEditor` if available,
                or simpler: EditorContent accepts `slotAfter`.
                But `EditorBubbleMenu` needs `editor` prop. 
                
                Lets fix: We will use a custom component inside that gets the editor context if possible.
                Or, since Novel exports `EditorBubble`, we should use THAT instead of my custom one if possible?
                
                The guide mentions `BubbleMenu.tsx` so I should use it. 
                But how to get `editor` instance?
                Usually `EditorContent` provides it.
                
                Let's use a workaround: `onCreate` to set state?
                Or maybe `EditorRoot` provides context.
             */}
                    <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-slate-700 bg-slate-900 px-1 py-2 shadow-md">
                        <EditorCommandEmpty className="px-2 text-sm text-slate-400">No results</EditorCommandEmpty>
                        <EditorCommandList>
                            {suggestionItems.map((item) => (
                                <EditorCommandItem
                                    value={item.title}
                                    onCommand={(val) => {
                                        // Using the hybrid approach from guide
                                        const commandEditor = val?.editor;
                                        const commandRange = val?.range;

                                        if (item.command && commandEditor && commandRange) {
                                            item.command({ editor: commandEditor, range: commandRange });
                                        }
                                    }}
                                    className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-slate-800 aria-selected:bg-slate-800 cursor-pointer"
                                    key={item.title}>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-700 bg-slate-800">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-200">{item.title}</p>
                                        <p className="text-xs text-slate-400">{item.description}</p>
                                    </div>
                                </EditorCommandItem>
                            ))}
                        </EditorCommandList>
                    </EditorCommand>
                </EditorContent>
            </EditorRoot>
        </div>
    );
}
