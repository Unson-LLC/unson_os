const path = require('path')

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
  
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // fsevents問題解決：サーバーサイドでの除外
    if (isServer) {
      config.externals = config.externals || []
      config.externals.push('fsevents')
    }
    
    // Mastra関連のバイナリファイル除外
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      url: false,
      zlib: false,
      http: false,
      https: false,
      assert: false,
      os: false,
      path: false,
    }
    
    // バイナリファイルの除外ルール
    config.module.rules.push({
      test: /\.node$/,
      loader: 'ignore-loader'
    })
    
    // Mastraモジュールのパス解決
    config.resolve.alias = {
      ...config.resolve.alias,
      'mastra': path.resolve(__dirname, '../../mastra')
    }
    
    return config
  },
  
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