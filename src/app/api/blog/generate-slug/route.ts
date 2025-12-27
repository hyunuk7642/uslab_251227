import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const title = body.title;

        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return NextResponse.json(
                { error: 'Title is required.' },
                { status: 400 }
            );
        }

        // Mock implementation for local testing (No API Key required)
        const fallbackSlug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .trim()
            .substring(0, 50);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        return NextResponse.json({ slug: fallbackSlug || 'untitled-post' });

    } catch (error: any) {
        console.error('Error generating slug:', error);
        return NextResponse.json(
            { error: error.message || 'Error generating slug.' },
            { status: 500 }
        );
    }
}
