import type { PainCategory, UseCaseDefinition } from './types';

const DEFINITIONS: Record<PainCategory, UseCaseDefinition> = {
  sales_ops: {
    pain_category: 'sales_ops',
    primary_use_case: 'sales_ai_employee',
    target_function: 'sales',
    title: '営業AI社員',
    target_workflow: '商談後の議事録整理、CRM更新、次アクション作成',
    reason: '入力、判断、出力が定型化しやすく、毎週発生する業務だから',
    first_poc_scope: '商談メモからCRM更新案と次アクションを生成する',
    claude_code_use_cases: [
      '商談メモからCRM更新案を生成する',
      '提案書のたたき台を作る',
      '次アクションと担当者を抽出する',
    ],
    likely_bottlenecks: [
      'どこまでAIに任せるかが曖昧',
      '人間が確認すべき判断境界が未定',
      'CRMや議事録の正本が分かれている',
    ],
  },
  pm_dev: {
    pain_category: 'pm_dev',
    primary_use_case: 'pm_dev_ai_employee',
    target_function: 'product_development',
    title: 'PM/開発AI社員',
    target_workflow: '要件定義、仕様化、Issue分解、レビュー観点生成',
    reason: '曖昧な依頼を開発可能な単位へ落とす反復作業が多いから',
    first_poc_scope: '議事録や要望からIssue分解と受け入れ条件を作る',
    claude_code_use_cases: [
      '要望から仕様ドラフトを作る',
      'Issueを実装可能な粒度へ分解する',
      'レビュー観点とテスト観点を生成する',
    ],
    likely_bottlenecks: [
      '要求の正本が会話とドキュメントに分散している',
      '完了条件が曖昧なまま実装に進む',
      'AIが触ってよい範囲と人間承認の境界が未定',
    ],
  },
  research_docs: {
    pain_category: 'research_docs',
    primary_use_case: 'research_ai_employee',
    target_function: 'research',
    title: '調査AI社員',
    target_workflow: '市場/競合調査brief、資料下書き、示唆抽出',
    reason: '情報収集、整理、仮説化を同じ型で繰り返しやすいから',
    first_poc_scope: '競合調査briefと示唆メモを毎週作成する',
    claude_code_use_cases: [
      '調査観点を分解してbriefを作る',
      '公開情報から比較表を作る',
      '資料のたたき台と示唆を抽出する',
    ],
    likely_bottlenecks: [
      '一次情報と推測が混ざりやすい',
      '調査結果の活用先が不明確',
      '更新頻度と鮮度管理が決まっていない',
    ],
  },
  management_ops: {
    pain_category: 'management_ops',
    primary_use_case: 'management_ai_employee',
    target_function: 'management',
    title: '経営AI社員',
    target_workflow: '会議ログから決定事項、タスク、Ship候補を抽出',
    reason: '経営会議後の整理と実行接続がボトルネックになりやすいから',
    first_poc_scope: '会議ログから決定記録、次アクション、推進案件候補を作る',
    claude_code_use_cases: [
      '会議ログから決定事項を抽出する',
      'Ship候補とタスクを生成する',
      '未決事項と論点を整理する',
    ],
    likely_bottlenecks: [
      '決定事項と会話メモが分離していない',
      '責任者と期限が曖昧',
      'タスク化後の追跡場所が決まっていない',
    ],
  },
  support_backoffice: {
    pain_category: 'support_backoffice',
    primary_use_case: 'ops_ai_employee',
    target_function: 'operations',
    title: '業務AI社員',
    target_workflow: '問い合わせ、FAQ、請求/契約処理の下書き',
    reason: '定型対応が多く、下書きと確認の分離で効果を出しやすいから',
    first_poc_scope: '問い合わせ文面から回答案と社内確認事項を生成する',
    claude_code_use_cases: [
      '問い合わせから回答案を作る',
      'FAQ候補を抽出する',
      '請求/契約処理の確認リストを作る',
    ],
    likely_bottlenecks: [
      '例外対応の判断基準が未整理',
      '顧客情報の参照権限が曖昧',
      '最終確認者が決まっていない',
    ],
  },
  unknown: {
    pain_category: 'unknown',
    primary_use_case: 'workflow_discovery',
    target_function: 'workflow_discovery',
    title: '業務棚卸しAI社員',
    target_workflow: '業務フロー棚卸し、AI社員化候補抽出',
    reason: 'まず業務を見える化すると、AI社員化しやすい反復業務を特定できるから',
    first_poc_scope: '主要業務を棚卸ししてAI社員化候補を3つに絞る',
    claude_code_use_cases: [
      '業務フローを分解する',
      '反復業務と判断業務を分類する',
      'PoC候補の優先順位を作る',
    ],
    likely_bottlenecks: [
      'どの業務から始めるかが決まっていない',
      '業務の正本が人に依存している',
      '成果指標が曖昧',
    ],
  },
};

export function normalizePainCategory(category?: string): PainCategory {
  if (category && category in DEFINITIONS) {
    return category as PainCategory;
  }

  return 'unknown';
}

export function getUseCaseDefinition(category?: string): UseCaseDefinition {
  return DEFINITIONS[normalizePainCategory(category)];
}
