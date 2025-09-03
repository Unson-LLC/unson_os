import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

// 🟢 GREEN: 最小実装 - 4時間毎Google Adsデータ同期
crons.interval(
  "ads-sync", 
  { hours: 4 }, 
  api.ads.syncGoogleAdsData
);

export default crons;
