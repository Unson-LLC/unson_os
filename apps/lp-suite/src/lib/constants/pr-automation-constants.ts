// PR自動作成機能定数定義
export const PR_AUTOMATION_CONSTANTS = {
  DEFAULT_CONFIG: {
    MAX_RETRIES: 3,
    RETRY_DELAY_BASE: 1000,
    BASE_BRANCH: 'main',
    CONFIG_PATHS: {
      LP_SESSIONS: 'config/lp-sessions',
      PHASE_SESSIONS: 'config/phase-sessions'
    }
  },

  BRANCH_PREFIXES: {
    OPTIMIZATION: 'feature/optimization',
    PHASE_TRANSITION: 'feature/phase-transition'
  },

  GITHUB_API: {
    BASE_URL: 'https://api.github.com',
    ACCEPT_HEADER: 'application/vnd.github.v3+json',
    CONTENT_TYPE: 'application/json',
    DEFAULT_OWNER: 'Unson-LLC',
    DEFAULT_REPO: 'unson_os'
  },

  PR_TEMPLATES: {
    OPTIMIZATION: {
      TITLE_PREFIX: 'LP最適化自動更新',
      SECTIONS: {
        SUMMARY: '最適化結果サマリー',
        PERFORMANCE: 'パフォーマンス指標',
        CONTENT: '最適化内容',
        IMPROVEMENTS: '改善項目',
        HISTORY: '自動化実行履歴'
      },
      FOOTER: '🤖 この PR は LP検証システムにより自動生成されました'
    },
    PHASE_TRANSITION: {
      TITLE_PREFIX: 'フェーズ移行自動実行',
      SECTIONS: {
        SUMMARY: 'フェーズ移行サマリー',
        TRANSITION: '移行詳細',
        REASONS: '移行理由',
        PERFORMANCE: '現在のパフォーマンス',
        CONFIG: '新フェーズ設定',
        HISTORY: '自動化実行履歴'
      },
      FOOTER: '🤖 この PR は フェーズ移行システムにより自動生成されました'
    }
  },

  NOTIFICATION: {
    DISCORD: {
      COLORS: {
        SUCCESS: 0x00ff00,
        ERROR: 0xff0000,
        INFO: 0x0066cc
      },
      EMOJIS: {
        OPTIMIZATION: '🚀',
        PHASE_TRANSITION: '📈',
        ERROR: '❌',
        SUCCESS: '✅'
      }
    }
  },

  ERROR_MESSAGES: {
    INVALID_SESSION_ID: 'セッションIDが無効または最適化データが不正です',
    AUTH_ERROR: '認証エラー: GitHub トークンを確認してください',
    PHASE_TRANSITION_CONDITIONS_NOT_MET: 'フェーズ移行条件が満たされていません',
    GITHUB_API_ERROR: 'GitHub API Error',
    DISCORD_NOTIFICATION_FAILED: 'Discord通知の送信に失敗しました',
    WEBHOOK_NOTIFICATION_FAILED: 'Webhook通知の送信に失敗しました',
    CONNECTION_TEST_FAILED: 'PR自動作成機能のテストに失敗しました'
  },

  ENV_VARS: {
    GITHUB_TOKEN: 'GITHUB_TOKEN',
    GITHUB_OWNER: 'GITHUB_OWNER',
    GITHUB_REPO: 'GITHUB_REPO',
    DISCORD_WEBHOOK_URL: 'DISCORD_WEBHOOK_URL',
    WEBHOOK_URL: 'WEBHOOK_URL'
  },

  FILE_EXTENSIONS: {
    JSON: '.json'
  },

  DATE_FORMAT: {
    ISO_DATE_ONLY: 'YYYY-MM-DD',
    JAPANESE_LOCALE: 'ja-JP',
    TIMEZONE_TOKYO: 'Asia/Tokyo'
  }
} as const;

export const PR_TYPE = {
  OPTIMIZATION: 'optimization',
  PHASE_TRANSITION: 'phase-transition'
} as const;

export const PR_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
  PENDING: 'pending'
} as const;