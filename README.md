This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# NextAuth 설정
GITHUB_ID=your_github_oauth_app_client_id
GITHUB_SECRET=your_github_oauth_app_client_secret
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# GitHub API 설정
GITHUB_TOKEN=your_github_personal_access_token

# GitHub Repository 설정
NEXT_PUBLIC_REPO_OWNER=hyunuk7642
NEXT_PUBLIC_REPO_NAME=uslab_251227
```

### Netlify 배포 시 환경 변수 설정

Netlify 대시보드에서 다음 환경 변수들을 설정해야 합니다:

1. **Site settings** > **Environment variables**로 이동
2. 위의 모든 환경 변수를 추가
3. `NEXTAUTH_URL`은 배포된 사이트 URL로 설정 (예: `https://your-site.netlify.app`)

## Deploy on Netlify

This project is configured to deploy on Netlify using the `@netlify/plugin-nextjs` plugin.

1. Push your code to GitHub
2. Connect your repository to Netlify
3. **중요**: Netlify UI에서 **Site settings** > **Build & deploy** > **Build settings**로 이동하여:
   - **Publish directory**를 비워두거나 제거하세요 (빈 값으로 설정)
   - `@netlify/plugin-nextjs` 플러그인이 자동으로 처리하므로 publish 디렉토리를 설정하면 안 됩니다
4. Set the environment variables in Netlify dashboard
5. Deploy!

The `netlify.toml` file is already configured with the correct settings.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
