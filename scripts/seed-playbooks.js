#!/usr/bin/env node

/**
 * プレイブックデータをConvexに投入するスクリプト
 * Usage: node scripts/seed-playbooks.js
 */

const { ConvexHttpClient } = require("convex/browser");

// Convex設定
const CONVEX_URL = process.env.CONVEX_URL || "https://api.convex.dev";
const WORKSPACE_ID = process.env.WORKSPACE_ID || "unson-os-default";
const client = new ConvexHttpClient(CONVEX_URL);

// プレイブックデータ
const playbooksData = [
  {
    id: "pb-001",
    name: "LP CVRテスト",
    description: "ランディングページのコンバージョン率を測定し、市場仮説を検証する",
    version: "1.0",
    category: "lp-validation",
    steps: [
      {
        stepNumber: 1,
        title: "LP設計・作成",
        description: "価値提案を明確にしたランディングページを作成",
        estimatedTime: "2-3日",
        requiredTools: ["Next.js", "Tailwind CSS", "PostHog"],
        successCriteria: [
          "明確な価値提案が表現されている",
          "CTAボタンが適切に配置されている",
          "レスポンシブデザインが実装されている"
        ]
      },
      {
        stepNumber: 2,
        title: "分析基盤セットアップ",
        description: "PostHogやGoogle Analyticsで測定環境を構築",
        estimatedTime: "1日",
        requiredTools: ["PostHog", "Google Analytics"],
        successCriteria: [
          "イベント追跡が正常に動作している",
          "コンバージョンファネルが設定されている"
        ]
      },
      {
        stepNumber: 3,
        title: "広告キャンペーン実施",
        description: "Google Ads等で1,000セッション以上を集客",
        estimatedTime: "1-2週間",
        requiredTools: ["Google Ads", "Facebook Ads"],
        successCriteria: [
          "1,000セッション以上達成",
          "品質の高いトラフィック確保"
        ]
      },
      {
        stepNumber: 4,
        title: "データ分析・改善",
        description: "CVRデータを分析し、必要に応じてA/Bテスト実施",
        estimatedTime: "3-5日",
        requiredTools: ["PostHog", "Google Analytics"],
        successCriteria: [
          "CVR 10%以上達成",
          "ユーザー行動の分析完了"
        ]
      }
    ],
    successMetrics: [
      {
        name: "コンバージョン率（CVR）",
        targetValue: "10%以上",
        measurement: "メール登録数 / 訪問者数"
      },
      {
        name: "セッション数",
        targetValue: "1,000以上",
        measurement: "期間内の総セッション数"
      },
      {
        name: "直帰率",
        targetValue: "50%以下",
        measurement: "1ページのみ閲覧したセッション率"
      }
    ]
  },
  {
    id: "pb-002",
    name: "広告キャンペーン最適化",
    description: "広告配信を最適化してCPAを改善する",
    version: "1.0",
    category: "lp-validation",
    steps: [
      {
        stepNumber: 1,
        title: "キーワード分析",
        description: "効果的なキーワードを特定し、競合分析を実施",
        estimatedTime: "1-2日",
        requiredTools: ["Google Keyword Planner", "SEMrush"],
        successCriteria: [
          "ターゲットキーワード30個以上特定",
          "競合広告の分析完了"
        ]
      },
      {
        stepNumber: 2,
        title: "広告クリエイティブ作成",
        description: "複数の広告バリエーションを作成",
        estimatedTime: "2-3日",
        requiredTools: ["Canva", "Adobe Creative Suite"],
        successCriteria: [
          "広告クリエイティブ5種類以上作成",
          "A/Bテスト設計完了"
        ]
      },
      {
        stepNumber: 3,
        title: "キャンペーン実行",
        description: "段階的に予算を投入し、データを収集",
        estimatedTime: "1-2週間",
        requiredTools: ["Google Ads", "Facebook Ads Manager"],
        successCriteria: [
          "クリック率2%以上",
          "CPA目標値以下達成"
        ]
      }
    ],
    successMetrics: [
      {
        name: "クリック率（CTR）",
        targetValue: "2%以上",
        measurement: "クリック数 / インプレッション数"
      },
      {
        name: "獲得単価（CPA）",
        targetValue: "3,000円以下",
        measurement: "広告費 / コンバージョン数"
      }
    ]
  }
];

async function seedPlaybooks() {
  try {
    console.log("🌱 プレイブックデータを投入中...");
    
    for (const playbook of playbooksData) {
      // 既存データをチェック
      const existing = await client.query("playbooks:getPlaybook", { 
        workspace_id: WORKSPACE_ID,
        id: playbook.id 
      });
      
      if (existing) {
        console.log(`⏭️  ${playbook.id} は既に存在するためスキップ`);
        continue;
      }
      
      // データ投入
      const now = Date.now();
      await client.mutation("playbooks:createPlaybook", {
        workspace_id: WORKSPACE_ID,
        ...playbook,
        createdAt: now,
        updatedAt: now,
      });
      
      console.log(`✅ ${playbook.id}: ${playbook.name} を投入完了`);
    }
    
    console.log("🎉 プレイブックデータ投入完了！");
    
  } catch (error) {
    console.error("❌ エラーが発生しました:", error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  seedPlaybooks();
}