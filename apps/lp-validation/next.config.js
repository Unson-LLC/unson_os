/** @type {import('next').NextConfig} */
const nextConfig = {
  // 本番環境最適化
  compress: true,
  poweredByHeader: false,
  
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  transpilePackages: ['convex'],
  
  // 環境変数（デフォルト値設定）
  env: {
    CONVEX_URL: process.env.CONVEX_URL || 'https://default.convex.cloud',
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL || 'https://default.convex.cloud',
    GOOGLE_ADS_CLIENT_ID: process.env.GOOGLE_ADS_CLIENT_ID || 'default-client-id',
    GOOGLE_ADS_CLIENT_SECRET: process.env.GOOGLE_ADS_CLIENT_SECRET || 'default-secret',
    GOOGLE_ADS_DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || 'default-token',
    GOOGLE_ADS_REFRESH_TOKEN: process.env.GOOGLE_ADS_REFRESH_TOKEN || 'default-refresh',
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'sk-default',
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN || 'default-bot-token',
    DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL || 'https://discord.com/api/webhooks/default',
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || 'ghp_default',
    GITHUB_OWNER: process.env.GITHUB_OWNER || 'Unson-LLC',
    GITHUB_REPO: process.env.GITHUB_REPO || 'unson_os',
  },

  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // 静的最適化
  trailingSlash: false,
  
  // 画像最適化
  images: {
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig