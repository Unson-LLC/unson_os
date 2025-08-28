import { cronJobs } from "convex/server";

// 一時的に全スケジュールを無効化（未実装の関数参照によるデプロイ失敗回避）
// 必要なジョブ実装が揃い次第、ここで再度登録します。
const crons = cronJobs();
export default crons;
