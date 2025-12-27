import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Netlify 배포를 위한 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
  },
};

export default nextConfig;
