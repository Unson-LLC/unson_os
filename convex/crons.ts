import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// 4時間サイクル: Google Ads最適化
crons.interval(
  "google-ads-optimization",
  { hours: 4 }, // 4時間ごと
  api.automation.optimizeGoogleAds
);

// 24時間サイクル: LP改善提案生成
crons.daily(
  "lp-improvement-suggestions", 
  { hourUTC: 2, minuteUTC: 0 }, // JST 11:00 (UTC+9)
  api.automation.generateLPImprovements
);

// 1時間サイクル: セッションメトリクス更新
crons.interval(
  "session-metrics-update",
  { hours: 1 }, // 1時間ごと
  api.automation.updateSessionMetrics
);

// 30分サイクル: アラートチェック
crons.interval(
  "alert-monitoring",
  { minutes: 30 }, // 30分ごと
  api.automation.checkAndCreateAlerts
);

// 週次: システムクリーンアップ
crons.weekly(
  "system-cleanup",
  { 
    dayOfWeek: "sunday", // 日曜日
    hourUTC: 1, 
    minuteUTC: 0 
  }, // JST 10:00
  api.automation.performSystemCleanup
);

// 日次: フェーズ移行評価
crons.daily(
  "phase-transition-evaluation",
  { hourUTC: 3, minuteUTC: 0 }, // JST 12:00
  api.automation.evaluatePhaseTransitions
);

export default crons;