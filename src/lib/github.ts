
import { Octokit } from 'octokit';
import { Buffer } from 'buffer';

export class GitHubService {
    private octokit: Octokit;
    private owner: string;
    private repo: string;
    private branch: string;

    constructor() {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            // Fallback for local dev if mock is needed, but we want to warn
            console.warn('GITHUB_TOKEN is missing. Read-only or Mock mode.');
        }

        this.octokit = new Octokit({ auth: token });
        this.owner = process.env.NEXT_PUBLIC_REPO_OWNER || 'hyunuk7642';
        this.repo = process.env.NEXT_PUBLIC_REPO_NAME || 'uslab_251227';
        this.branch = 'main';
    }

    async getFileSha(path: string): Promise<string | undefined> {
        try {
            const { data } = await this.octokit.rest.repos.getContent({
                owner: this.owner,
                repo: this.repo,
                path,
                ref: this.branch,
            });

            if (Array.isArray(data)) {
                return undefined; // It's a directory
            }
            return (data as any).sha;
        } catch (error: any) {
            if (error.status === 404) return undefined;
            throw error;
        }
    }

    async createOrUpdateFile(path: string, content: string | Buffer, message: string) {
        if (!process.env.GITHUB_TOKEN) {
            // Mock save for local dev without token
            console.log(`[MockGitHub] Saving to ${path}:`, content.toString().substring(0, 50) + '...');
            return { content: { path, html_url: `http://localhost:3001/${path}` } };
        }

        const sha = await this.getFileSha(path);
        const encoding = typeof content === 'string' ? 'utf-8' : 'base64';
        const contentEncoded = typeof content === 'string'
            ? Buffer.from(content).toString('base64')
            : content.toString('base64');

        const { data } = await this.octokit.rest.repos.createOrUpdateFileContents({
            owner: this.owner,
            repo: this.repo,
            path,
            message,
            content: contentEncoded,
            sha,
            branch: this.branch,
        });

        return data;
    }

    async uploadImage(file: File): Promise<string> {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const path = `public/images/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

        await this.createOrUpdateFile(path, buffer, `Upload image: ${file.name}`);

        // Return the raw GitHub URL or local path
        // For direct access in app, we serve from public/, so:
        // In dev: /images/... (but new files won't appear until rebuild/restart usually in local dev not really)
        // Actually nextjs public folder dynamic content... 
        // Best practice for Git CMS: Push to repo -> Netlify builds -> Image is available.
        // BUT "Wait for build" is slow for previews.
        // So we return the raw.githubusercontent URL for immediate preview (if public repo)
        // Or blob url for local preview?
        // Using raw url:
        return `https://raw.githubusercontent.com/${this.owner}/${this.repo}/${this.branch}/${path.replace('public/', '')}`;
        // Note: path in repo is public/images/foo.png. 
        // raw url: .../main/public/images/foo.png
    }

    async createPost(slug: string, content: string, frontmatter: any) {
        const path = `content/posts/${slug}.md`;
        const matter = require('gray-matter');
        const fileContent = matter.stringify(content, frontmatter);

        await this.createOrUpdateFile(path, fileContent, `feat(blog): Create post ${slug}`);
        return path;
    }
}

export const githubService = new GitHubService();
