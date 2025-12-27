
import { NextRequest, NextResponse } from 'next/server';
import { githubService } from '@/lib/github';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { title, slug, content, markdown } = body;
        // content is JSON, markdown is string string

        if (!title || !slug || !markdown) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const frontmatter = {
            title,
            date: new Date().toISOString(),
            author: session.user?.name || session.user?.email || 'Anonymous',
        };

        const path = await githubService.createPost(slug, markdown, frontmatter);

        return NextResponse.json({ success: true, path });
    } catch (error: any) {
        console.error('Save post error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
