# LLM×Runbookアーキテクチャ（Ads運用）

## 概要
UnsonOSの100-200個のマイクロSaaSプロダクトのGoogle Ads運用を、LLMとRunbookベースで自動化するアーキテクチャ設計。

## 5レイヤー構成

### 1. Knowledge（知識）レイヤー

Git管理の「ドキュメント as コード」として、すべての運用知識を構造化。

```yaml
# ディレクトリ構造
/playbooks/
  /search/
    pause-low-ctr.yml        # CTR低下時の一時停止ルール
    boost-high-performer.yml # 高パフォーマンスKW強化
  /budget/
    daily-pacing.yml         # 日予算ペーシング
/policies/
  /brand/
    brand-exclusion.yml      # ブランド保護ポリシー
  /safety/
    max-change-limits.yml    # 変更幅制限
/patterns/
  free-intent-scaling.md     # 「無料」意図の成功パターン
  diagnosis-keywords.md      # 診断系キーワード戦略
/taxonomy/
  intent.yml                 # 検索意図の分類体系
```

#### YAMLフロントマター例（Pauseルール）

```yaml
# /playbooks/search/pause-low-ctr.yml
---
id: pause-low-ctr
stage: explore
risk_tier: low
applies_to: [search_keyword]
intent: [self-analysis, free-tool]
kpi: ctr
threshold:
  ctr_wilson_lower_pct_lt: 1.5
  impressions_min: 150
action: pause_keyword
cooldown_hours: 24
tests:
  - given: {impr: 200, clicks: 1} 
    expect: pause
  - given: {impr: 80, clicks: 3}  
    expect: hold
explanations:
  user_friendly: >
    サンプル不足の誤停止を避けるため信頼区間の下限を使います。
---

## 本文
低CTRキーワードを適切なタイミングで一時停止するプレイブック...
```

### 2. Retrieval（RAG）レイヤー

pgvector（Supabase/Postgres）でドキュメントの埋め込みとメタデータフィルタリング。

```python
# 検索クエリの構成
query = {
    "product_features": "20-30代女性向け自己分析AIツール",
    "current_metrics": "CTR: 0.5%, Conv: 0, Impr: 523",
    "intended_action": "キーワード最適化",
    "stage": "explore"
}

# 製品×意図×ステージに合うドキュメントを取得
relevant_docs = retrieval.search(
    query=query,
    filters={
        "intent": ["free-tool", "self-analysis"],
        "stage": "explore",
        "risk_tier": ["low", "medium"]
    }
)
```

### 3. Agent Layer（プラン→監査→実行）

#### 3.1 Planner（計画立案）
```python
class Planner:
    def create_proposal(self, context, retrieved_docs):
        # LLMが関連SOPを読んで提案を生成
        proposal = llm.generate(
            template="proposal_template",
            context=context,
            docs=retrieved_docs
        )
        return DecisionCard(proposal)
```

#### 3.2 Risk Officer（リスク検証）
```python
class RiskOfficer:
    def validate(self, card: DecisionCard, context):
        violations = []
        
        # ポリシー違反チェック
        if card.bid_change > 0.3:
            violations.append("bid_change_exceeds_limit")
        
        # クールダウン期間チェック
        if not self.cooldown_elapsed(card):
            violations.append("cooldown_not_elapsed")
        
        # 予算上限チェック
        if self.exceeds_intent_cap(card):
            violations.append("intent_budget_cap_exceeded")
        
        return violations
```

#### 3.3 Executor（実行）
```python
class Executor:
    def apply(self, card: DecisionCard):
        for action in card.actions:
            if action.type == "pause_keyword":
                ads.pause_keyword(action.params)
            elif action.type == "set_bid":
                ads.set_bid(action.params)
            # ...
```

#### 3.4 Critic（事後評価）
```python
class Critic:
    def evaluate(self, execution_result, after_metrics):
        # 24-72時間後の効果を測定
        learning = {
            "proposal_id": execution_result.id,
            "impact": calculate_impact(after_metrics),
            "lessons": extract_lessons(execution_result)
        }
        # 成功パターンをpatterns/に追記
        if learning.impact > 0:
            append_to_patterns(learning)
```

### 4. Tools（関数群）レイヤー

型安全な関数を提供：

```python
# Google Ads操作
ads.pause_keyword()
ads.set_bid()
ads.add_negative()
ads.brand_exclude()
ads.get_search_terms()

# 数理計算（LLMから分離）
bandit.suggest_allocation()     # Thompson Sampling
bayes.interval()                # ベイズ信頼区間
guardrails.wilson_lower_bound() # Wilson下限
```

### 5. Memory/Logs（学習器）レイヤー

決定カードの完全記録：

```yaml
# 決定カードのスキーマ
proposal_id: uuid-123
product_id: watashinocompass
timestamp: 2025-01-10T10:00:00Z
references:  # RAGで参照したドキュメント
  - playbooks/search/pause-low-ctr.yml#L1-L30
  - taxonomy/intent.yml#free-tool
inputs: 
  impressions: 523
  clicks: 99
  conversions: 2
  ctr: 18.9
actions:
  - type: set_budget_cap
    scope: intent=free-tool
    cap_pct_of_product_daily: 20
  - type: add_negatives
    terms: ["完全無料", "ダウンロード"]
  - type: pause_keyword_if
    rule: pause-low-ctr
safety: 
  cooldown_hours: 24
  max_bid_change_pct: 30
outcome:  # 72時間後に追記
  ctr_change: +15%
  cpa_change: -30%
  learning: "無料系は入札を抑えめにする方が効率的"
```

## 意図タクソノミー設計

```yaml
# /taxonomy/intent.yml
intents:
  - id: free-tool
    desc: 無料ツール探し
    risk: high_cpa
    budget_cap_pct: 20
    promotion_rule: "needs_micro_cv>=3% and paid_conv>=N"
    negative_keywords: 
      - 完全無料
      - ダウンロード
      - フリーソフト
  
  - id: diagnosis-seeking
    desc: 診断・自己理解志向
    risk: medium
    budget_cap_pct: 40
    positive_signals:
      - 診断
      - 分析
      - 性格
```

## クロスプロダクト学習

### ケースメモリ（Case-Based Memory）

```python
# 類似性判定
def calculate_similarity(product_a, product_b):
    embed_a = create_embedding(
        product_a.title + 
        product_a.lp_headline + 
        product_a.target_persona
    )
    embed_b = create_embedding(...)
    return cosine_similarity(embed_a, embed_b)

# 横展開ロジック
def cross_product_apply(success_case):
    similar_products = find_similar(
        success_case.product_id, 
        threshold=0.8
    )
    for product in similar_products:
        # 小配分（10-20%）でテスト
        apply_with_sandbox(
            product_id=product.id,
            actions=success_case.actions,
            budget_ratio=0.15
        )
```

## セーフガード（4層防御）

### 1. ポリシー文書
- ブランド除外リスト
- 共有ネガティブキーワード
- NGカテゴリ定義
- 変更幅制限（30%以内）
- クールダウン期間（24時間）
- HITL（人間介入）条件

### 2. 数値ガード
```python
guards = {
    "daily_budget_cap": 30000,  # 円
    "product_budget_cap": 3000,  # 円/製品
    "intent_budget_cap_pct": 20,  # %
    "max_bid_change_pct": 30,
    "min_impressions_for_action": 100
}
```

### 3. 実行前ドライラン
```python
def dryrun(proposal, historical_data):
    # 過去7日のデータで"もしやってたら"をシミュレート
    simulated_result = simulate(
        proposal.actions,
        historical_data
    )
    if simulated_result.cpa_increase > 1.5:
        return "REJECT: CPA悪化リスク"
    return "APPROVE"
```

### 4. サンドボックス運用
```python
# 新キーワード/広告は隔離環境でテスト
sandbox_config = {
    "duration_days": 3,
    "budget_ratio": 0.1,  # 本番の10%
    "success_criteria": {
        "ctr": ">= 5%",
        "conversions": ">= 1"
    }
}
```

## 技術スタック

### コアアーキテクチャ
- **中核エージェント**: LangChain + LangGraph (Python)
  - ステートフルな長時間運用に最適
  - Google Ads公式Pythonクライアントとの直接統合
  - LangSmithによる強力な観測性と監査機能
- **フロントエンド連携**: Mastra (TypeScript)
  - 各SaaSのコピー生成、RAG回答など軽量タスク
  - Next.js/Vercelへのサーバーレスデプロイ
  - MCPプロトコル対応でツール連携が容易

### インフラ
- **ドキュメント**: Git + Markdown/YAML
- **ベクトルDB**: pgvector (Supabase)
- **オーケストレーター**: LangGraph + FastAPI
- **スケジューラー**: GitHub Actions / Cloud Scheduler
- **データウェアハウス**: PostgreSQL
- **観測性**: LangSmith (エージェント監視・評価)

### LangGraph実装例
```python
from langgraph.graph import StateGraph, END
from langgraph.checkpoint import MemorySaver
from langchain_core.messages import HumanMessage
from langchain_anthropic import ChatAnthropic

# ステートフルなAds運用エージェント
class AdsOptimizationGraph:
    def __init__(self):
        self.llm = ChatAnthropic(model="claude-3-opus")
        self.workflow = StateGraph(dict)
        
        # ノード定義
        self.workflow.add_node("retrieve_docs", self.retrieve_relevant_docs)
        self.workflow.add_node("plan", self.create_proposal)
        self.workflow.add_node("risk_check", self.validate_risks)
        self.workflow.add_node("execute", self.apply_changes)
        self.workflow.add_node("evaluate", self.post_evaluation)
        
        # エッジ定義（条件分岐）
        self.workflow.add_conditional_edges(
            "risk_check",
            self.risk_router,
            {
                "approved": "execute",
                "needs_human": "human_review",
                "rejected": END
            }
        )
        
        # チェックポイント（状態永続化）
        self.memory = MemorySaver()
        self.app = self.workflow.compile(checkpointer=self.memory)
    
    def risk_router(self, state):
        """リスクレベルに応じた分岐"""
        if state["risk_score"] > 0.8:
            return "rejected"
        elif state["requires_human"]:
            return "needs_human"
        return "approved"
```

### LLM運用戦略
```python
# LangChainでのルーティング
from langchain.chat_models import ChatAnthropic
from langchain.callbacks import LangsmithCallbackHandler

class ModelRouter:
    def __init__(self):
        # LangSmith統合で全呼び出しを追跡
        self.callbacks = [LangsmithCallbackHandler()]
        
        self.models = {
            "classification": ChatAnthropic(
                model="claude-3-haiku",
                callbacks=self.callbacks
            ),
            "generation": ChatAnthropic(
                model="claude-3-opus",
                callbacks=self.callbacks
            ),
            "analysis": ChatAnthropic(
                model="claude-3-sonnet",
                callbacks=self.callbacks
            )
        }
    
    def route(self, task_type):
        return self.models.get(task_type, self.models["analysis"])

# 構造化出力（LangChain標準機能）
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import PromptTemplate

parser = PydanticOutputParser(pydantic_object=DecisionCard)
prompt = PromptTemplate(
    template="Generate a decision card:\n{format_instructions}\n{query}",
    input_variables=["query"],
    partial_variables={"format_instructions": parser.get_format_instructions()}
)
```

## MVP実装計画（3ヶ月）

### Week 1-2: 基盤構築
- リポジトリ構造（playbooks/, policies/, patterns/, taxonomy/）
- LangGraph基本セットアップ
  - StateGraphの定義
  - Google Ads Pythonクライアント統合
  - LangSmith設定
- RAG基盤（pgvector）セットアップ
- guardrails実装（Wilson下限、予算ペーシング）
- 基本ツール（Pause/SetBid/AddNegative）

### Week 3-4: エージェントループ
- LangGraphでPlanner → Risk Officer → Executor フロー実装
- 状態管理とチェックポイント機能
- 決定カードの差分適用
- LangSmithでの監視開始
- Slack/Discord通知連携

### Week 5-8: 意図ベース運用
- intent taxonomyの運用開始
- ケースメモリ実装（LangChain Memory統合）
- バンディット配分導入
- Mastraでフロントエンド軽量タスク実装

### Week 9-12: スケール対応
- クロスプロダクト横展開
- LangSmith Evaluationsでオフライン評価
- シャドーモード → 本番移行
- パフォーマンス最適化

## コスト最適化戦略

### LLMコスト削減
```python
# 1. タスク別モデル選択
costs = {
    "classification": 0.001,  # Haiku
    "generation": 0.01,       # Sonnet
    "complex": 0.1           # Opus
}

# 2. RAG圧縮
def compress_docs(docs):
    # 長文SOPはセクション要約をキャッシュ
    summaries = cache.get_or_create(
        key=hash(docs),
        creator=lambda: summarize(docs)
    )
    return summaries

# 3. 出力最小化
output_format = "yaml_only"  # 余計な説明文なし
```

## わたしコンパスへの即適用例

```yaml
# 実際の適用例
product: watashinocompass
current_state:
  keywords:
    - {text: "自分軸 作り方", ctr: 0.5%, status: enabled}
    - {text: "無料 ai", ctr: 18.9%, status: removed}

proposal:
  references:
    - patterns/free-intent-scaling.md
    - taxonomy/intent.yml#free-tool
  actions:
    - type: pause_keyword
      target: "自分軸 作り方"
      reason: "CTR < 2% with 200+ impressions"
    - type: add_keywords
      keywords: ["無料 ai", "ai ツール 無料"]
      bid: 15000000
      reason: "Historical CTR 18.9%"
    - type: set_intent_cap
      intent: free-tool
      cap_pct: 20
      reason: "High CPA risk for free-seekers"
```

## 差別化ポイント

1. **Docs as Policy**: 運用知識がGit管理された資産
2. **決定カードの完全ログ**: 再現可能な運用履歴
3. **意図タクソノミー中心**: キーワードより検索意図で学習
4. **LLMは司令塔、数値はツール**: モデル進化に耐える設計
5. **小配分横展開**: リスクを抑えた学習転移

## まとめ

このアーキテクチャにより、UnsonOSは100-200個のマイクロSaaSプロダクトのGoogle Ads運用を、人間の学習プロセスを模倣しながら自動化できます。LLMは文脈理解と提案生成に特化し、数値判定や実行は専用ツールに委譲することで、安全かつスケーラブルな運用が実現します。