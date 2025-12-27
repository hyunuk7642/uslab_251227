'use client';

import { BubbleMenu } from '@tiptap/react';
import type { Editor } from '@tiptap/core';
import { Bold, Italic, Underline, Strikethrough, Code } from 'lucide-react';

interface BubbleMenuProps {
    editor: Editor;
}

export default function EditorBubbleMenu({ editor }: BubbleMenuProps) {
    if (!editor) {
        return null;
    }

    return (
        <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100 }}
            className="flex overflow-hidden rounded border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 ${editor.isActive('bold') ? 'is-active bg-slate-100 dark:bg-slate-800' : ''
                    }`}
            >
                <Bold size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 ${editor.isActive('italic') ? 'is-active bg-slate-100 dark:bg-slate-800' : ''
                    }`}
            >
                <Italic size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 ${editor.isActive('strike') ? 'is-active bg-slate-100 dark:bg-slate-800' : ''
                    }`}
            >
                <Strikethrough size={16} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 ${editor.isActive('code') ? 'is-active bg-slate-100 dark:bg-slate-800' : ''
                    }`}
            >
                <Code size={16} />
            </button>
        </BubbleMenu>
    );
}
