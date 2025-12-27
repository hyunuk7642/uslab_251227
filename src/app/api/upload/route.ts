
import { NextRequest, NextResponse } from 'next/server';
import { githubService } from '@/lib/github';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
    // Check auth
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const url = await githubService.uploadImage(file);
        return NextResponse.json({ url });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
