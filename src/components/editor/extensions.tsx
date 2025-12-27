'use client';

import { Command, createSuggestionItems, renderItems } from 'novel';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import YouTube from '@tiptap/extension-youtube';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { Markdown } from 'tiptap-markdown';
import {
    CheckSquare, Code, Heading1, Heading2, Heading3,
    List, ListOrdered, Text, TextQuote, Image as ImageIcon, Youtube,
} from 'lucide-react';

// Suggestion Items creation function (with upload function)
export const createSuggestionItemsWithUpload = (
    uploadFn?: (file: File) => Promise<string>,
    onEditorReady?: (editor: any) => void
) => {
    return createSuggestionItems([
        {
            title: 'Text',
            description: 'Start with plain text.',
            searchTerms: ['p', 'paragraph', 'text'],
            icon: <Text size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').run();
            },
        },
        {
            title: 'Heading 1',
            description: 'Big section heading.',
            searchTerms: ['title', 'big', 'h1', 'heading1'],
            icon: <Heading1 size={18} />,
            command: ({ editor, range }) => {
                if (editor && range) {
                    editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run();
                }
            },
        },
        {
            title: 'Heading 2',
            description: 'Medium section heading.',
            searchTerms: ['subtitle', 'medium', 'h2', 'heading2'],
            icon: <Heading2 size={18} />,
            command: ({ editor, range }) => {
                if (editor && range) {
                    editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run();
                }
            },
        },
        {
            title: 'Heading 3',
            description: 'Small section heading.',
            searchTerms: ['subtitle', 'small', 'h3', 'heading3'],
            icon: <Heading3 size={18} />,
            command: ({ editor, range }) => {
                if (editor && range) {
                    editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run();
                }
            },
        },
        {
            title: 'Bullet List',
            description: 'Create an unordered list.',
            searchTerms: ['unordered', 'point', 'list'],
            icon: <List size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBulletList().run();
            },
        },
        {
            title: 'Numbered List',
            description: 'Create an ordered list.',
            searchTerms: ['ordered', 'number', 'list'],
            icon: <ListOrdered size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleOrderedList().run();
            },
        },
        {
            title: 'To-do List',
            description: 'Create a task list.',
            searchTerms: ['todo', 'task', 'list', 'check', 'checkbox', 'todo'],
            icon: <CheckSquare size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleTaskList().run();
            },
        },
        {
            title: 'Quote',
            description: 'Insert a quote.',
            searchTerms: ['blockquote', 'quote'],
            icon: <TextQuote size={18} />,
            command: ({ editor, range }) =>
                editor.chain().focus().deleteRange(range).toggleNode('paragraph', 'paragraph').toggleBlockquote().run(),
        },
        {
            title: 'Code',
            description: 'Insert a code block.',
            searchTerms: ['codeblock', 'code'],
            icon: <Code size={18} />,
            command: ({ editor, range }) =>
                editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
        },
        {
            title: 'Image',
            description: 'Upload an image.',
            searchTerms: ['image', 'img', 'picture', 'photo'],
            icon: <ImageIcon size={18} />,
            command: ({ editor, range }) => {
                editor.chain().focus().deleteRange(range).run();
                if (onEditorReady) {
                    onEditorReady(editor);
                }

                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file && uploadFn) {
                        const maxSize = 50 * 1024 * 1024;
                        if (file.size > maxSize) {
                            alert(`Image size must be less than 50MB. Current: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
                            return;
                        }

                        try {
                            const url = await uploadFn(file);
                            editor.chain().focus().insertContent({
                                type: 'image',
                                attrs: {
                                    src: url,
                                },
                            }).run();
                        } catch (error: any) {
                            console.error('Image upload error:', error);
                            alert(error.message || 'Failed to upload image.');
                        }
                    }
                };
                input.click();
            },
        },
        {
            title: 'YouTube',
            description: 'Embed a YouTube video.',
            searchTerms: ['youtube', 'video', 'embed'],
            icon: <Youtube size={18} />,
            command: ({ editor, range }) => {
                const url = prompt('Enter YouTube URL:');
                if (!url) return;

                const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
                const match = url.match(youtubeRegex);

                if (match) {
                    const videoId = match[1];
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .insertContent({
                            type: 'youtube',
                            attrs: {
                                src: `https://www.youtube.com/embed/${videoId}`,
                            },
                        })
                        .run();
                } else {
                    alert('Invalid YouTube URL.\nEx: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID');
                }
            },
        },
    ]);
};

// Default suggestionItems (without upload function)
export const suggestionItems = createSuggestionItemsWithUpload();

// Slash Command extension configuration
export const createSlashCommand = (items: typeof suggestionItems) => {
    return Command.configure({
        suggestion: {
            items: () => items,
            render: renderItems,
        },
    });
};

export const slashCommand = createSlashCommand(suggestionItems);

// Tiptap Extensions
export const extensions = [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3],
        },

    }),
    TextStyle,
    Color,
    Highlight.configure({
        multicolor: true,
    }),
    Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
            class: 'rounded-lg',
        },
    }),
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: 'text-cyan-400 hover:text-cyan-300 underline',
        },
    }),
    YouTube.configure({
        width: 640,
        height: 480,
        HTMLAttributes: {
            class: 'rounded-lg w-full aspect-video',
        },
    }),
    TaskList,
    TaskItem.configure({
        nested: true,
    }),
    Placeholder.configure({
        placeholder: 'Press / for commands...',
        includeChildren: true,
    }),
    Markdown,
    slashCommand,
];
