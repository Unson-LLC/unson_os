import { TemplateConfig } from '@/types/template';
import { 
  copywritingTips, 
  getCopywritingTipsByCategory,
  CopywritingTip 
} from '@/data/copywriting-tips';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface LPGenerationPrompt {
  serviceName: string;
  serviceDescription: string;
  targetAudience: string;
  mainBenefit: string;
  pricing?: string;
  competitorAnalysis?: string;
  brandTone?: string;
}

// セクション別の関連コピーライティングコツを取得
function getSectionSpecificTips(section: string): CopywritingTip[] {
  const sectionCategoryMap: Record<string, string[]> = {
    'hero': ['ヘッドライン', '基本原則', '心理トリガー'],
    'problem': ['心理トリガー', 'ストーリー', '基本原則'],
    'solution': ['基本原則', '心理トリガー', '信頼性'],
    'pricing': ['価格戦略', '心理トリガー'],
    'cta': ['CTA', '心理トリガー'],
    'form': ['CTA', '信頼性']
  };

  const categories = sectionCategoryMap[section] || ['基本原則'];
  const tips: CopywritingTip[] = [];
  
  categories.forEach(category => {
    const categoryTips = getCopywritingTipsByCategory(category).slice(0, 3);
    tips.push(...categoryTips);
  });

  return tips.slice(0, 5); // 最大5個まで
}

// コピーライティングコツをプロンプト用テキストに変換
function formatTipsForPrompt(tips: CopywritingTip[]): string {
  return tips.map(tip => {
    const examples = tip.examples ? `\n例: ${tip.examples.join(', ')}` : '';
    return `• ${tip.title}: ${tip.description}${examples}`;
  }).join('\n');
}

// セクション別生成プロンプト
function createSectionPrompt(
  section: string, 
  prompt: LPGenerationPrompt, 
  tips: CopywritingTip[]
): string {
  const tipsText = formatTipsForPrompt(tips);
  
  const sectionPrompts = {
    hero: `
## ヒーローセクション生成指示

以下のコピーライティングの専門知識を活用して、効果的なヒーローセクションを作成してください：

${tipsText}

**サービス情報:**
- サービス名: ${prompt.serviceName}
- サービス説明: ${prompt.serviceDescription}  
- ターゲット: ${prompt.targetAudience}
- 主要ベネフィット: ${prompt.mainBenefit}
- ブランドトーン: ${prompt.brandTone || 'プロフェッショナル'}

**出力形式 (JSON):**
{
  "title": "感情を動かすヘッドライン（具体的数字・五感表現を含む）",
  "subtitle": "ベネフィット重視のサブタイトル（機能ではなく価値を強調）",
  "cta": "行動を促す動詞を使ったCTA",
  "secondaryCta": "リスク除去を表現したセカンダリCTA"
}`,

    problem: `
## 課題セクション生成指示

以下のコピーライティングの専門知識を活用して、共感を呼ぶ課題セクションを作成してください：

${tipsText}

**サービス情報:**
- ターゲット: ${prompt.targetAudience}
- 解決する課題: ${prompt.serviceDescription}

**出力形式 (JSON):**
{
  "title": "共感を呼ぶ課題タイトル",
  "subtitle": "感情的な訴求のサブタイトル", 
  "description": "ターゲットの痛みを具体化した説明",
  "problems": [
    {
      "title": "具体的な問題1（損失回避の心理を活用）",
      "description": "五感に訴える問題の詳細説明"
    }
    // 4-6個の問題
  ]
}`,

    solution: `
## ソリューションセクション生成指示

以下のコピーライティングの専門知識を活用して、説得力のあるソリューションセクションを作成してください：

${tipsText}

**サービス情報:**
- サービス名: ${prompt.serviceName}
- 主要ベネフィット: ${prompt.mainBenefit}
- ターゲット: ${prompt.targetAudience}

**出力形式 (JSON):**
{
  "title": "価値提案を明確にしたタイトル",
  "subtitle": "権威性・信頼性を示すサブタイトル",
  "description": "変化・変身の魅力を描いた説明",
  "solutions": [
    {
      "title": "ベネフィット重視のソリューション名",
      "description": "Before/After の劇的変化を表現"
    }
    // 2-3個のソリューション
  ]
}`,

    pricing: `
## 価格セクション生成指示

以下のコピーライティングの専門知識を活用して、魅力的な価格セクションを作成してください：

${tipsText}

**サービス情報:**
- サービス名: ${prompt.serviceName}
- 価格情報: ${prompt.pricing || '要問い合わせ'}
- 主要ベネフィット: ${prompt.mainBenefit}

**出力形式 (JSON):**
{
  "title": "価格の価値を強調するタイトル",
  "subtitle": "アンカリング効果を活用したサブタイトル",
  "plans": [
    {
      "name": "プラン名",
      "price": "価格（損失回避を意識した表現）",
      "period": "期間",
      "description": "バンドル価格の魅力を伝える説明",
      "features": ["機能ではなくベネフィットのリスト"],
      "cta": "希少性・緊急性を含むCTA"
    }
    // 2-3個のプラン
  ]
}`,

    cta: `
## 最終CTAセクション生成指示

以下のコピーライティングの専門知識を活用して、コンバージョンを最大化するCTAセクションを作成してください：

${tipsText}

**サービス情報:**
- サービス名: ${prompt.serviceName}
- 主要ベネフィット: ${prompt.mainBenefit}

**出力形式 (JSON):**
{
  "title": "今すぐ行動を促すタイトル",
  "subtitle": "即座の満足感を強調",
  "cta": "強い行動喚起の動詞を使用",
  "urgencyText": "希少性・緊急性の表現",
  "benefitsList": ["リスク除去を含む主要ベネフィット"]
}`
  };

  return sectionPrompts[section as keyof typeof sectionPrompts] || '';
}

// OpenAI APIでLP生成（リトライ機能付き）
export async function generateLPSection(
  section: string,
  prompt: LPGenerationPrompt,
  retryCount: number = 3
): Promise<{
  success: boolean;
  content?: any;
  error?: string;
}> {
  if (!OPENAI_API_KEY) {
    return { success: false, error: 'OPENAI_API_KEY is not configured' };
  }

  const tips = getSectionSpecificTips(section);
  const systemPrompt = `あなたは日本のコピーライティング専門家です。100個のコピーライティングコツを熟知し、効果的なランディングページを作成する専門家として行動してください。

重要な原則:
1. 感情が先、理屈は後
2. 機能ではなくベネフィットを伝える
3. 具体的な数字と五感表現を使用
4. ターゲットを明確に絞る
5. 心理トリガー（社会的証明、希少性、権威、返報性）を活用

**重要**: 回答は必ず有効なJSONフォーマットのみで返答してください。説明文やマークダウン記法は一切使用しないでください。`;

  const userPrompt = createSectionPrompt(section, prompt, tips);

  // リトライループ
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      console.log(`   🎯 Attempt ${attempt}/${retryCount} for ${section} section...`);

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-5',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          max_completion_tokens: 3000, // 推論に余裕を持たせる
          stream: false // ストリーミング無効
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`   ❌ API Error (attempt ${attempt}):`, errorData);
        
        if (attempt === retryCount) {
          throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
        
        // 指数バックオフでリトライ
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        continue;
      }

      const data = await response.json();
      
      // レスポンス構造の詳細ログ
      console.log(`   📊 Response structure for ${section}:`, {
        choices: data.choices?.length,
        hasContent: !!data.choices?.[0]?.message?.content,
        usage: data.usage,
        model: data.model
      });

      const content = data.choices?.[0]?.message?.content;

      if (!content || content.trim() === '') {
        console.warn(`   ⚠️  Empty content on attempt ${attempt} for ${section}`);
        
        if (attempt === retryCount) {
          throw new Error(`No content in response for ${section} after ${retryCount} attempts`);
        }
        
        // 短いディレイでリトライ
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }

      console.log(`   ✏️  Raw content for ${section} (${content.length} chars):`, content.substring(0, 200) + '...');

      // 複数のJSON抽出パターンを試行
      let parsedContent: any = null;
      
      // 1. 直接JSON解析
      try {
        parsedContent = JSON.parse(content.trim());
      } catch {
        // 2. JSON部分の抽出
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            parsedContent = JSON.parse(jsonMatch[0]);
          } catch {
            // 3. コードブロック内JSON
            const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
            if (codeBlockMatch) {
              try {
                parsedContent = JSON.parse(codeBlockMatch[1]);
              } catch (e) {
                console.error(`   ❌ JSON parse error in code block:`, e);
              }
            }
          }
        }
        
        // 4. 最後の手段：JSONオブジェクトの最初と最後を探す
        if (!parsedContent) {
          const firstBrace = content.indexOf('{');
          const lastBrace = content.lastIndexOf('}');
          
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            try {
              parsedContent = JSON.parse(content.substring(firstBrace, lastBrace + 1));
            } catch (e) {
              console.error(`   ❌ Final JSON parse attempt failed:`, e);
            }
          }
        }
      }

      if (!parsedContent) {
        console.warn(`   ⚠️  Could not parse JSON on attempt ${attempt} for ${section}`);
        console.log(`   📄 Full content:`, content);
        
        if (attempt === retryCount) {
          throw new Error(`Could not parse JSON response for ${section} after ${retryCount} attempts`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        continue;
      }

      console.log(`   ✅ Successfully parsed JSON for ${section} on attempt ${attempt}`);
      
      return {
        success: true,
        content: parsedContent
      };

    } catch (error) {
      console.error(`   ❌ Attempt ${attempt} failed for ${section}:`, error);
      
      if (attempt === retryCount) {
        return { 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error after all retries'
        };
      }
      
      // 指数バックオフでリトライ
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return { success: false, error: 'Unexpected retry loop exit' };
}

// 完全なLP生成（安定化版）
export async function generateFullLP(prompt: LPGenerationPrompt): Promise<{
  success: boolean;
  config?: Partial<TemplateConfig>;
  errors: string[];
  stats?: {
    totalSections: number;
    successfulSections: number;
    failedSections: number;
    totalTime: number;
  };
}> {
  const sections = ['hero', 'problem', 'solution', 'pricing', 'cta'];
  const results: Record<string, any> = {};
  const errors: string[] = [];
  const startTime = Date.now();

  console.log('🚀 Starting full LP generation with GPT-5...');
  console.log(`   📋 Service: ${prompt.serviceName}`);
  console.log(`   🎯 Target: ${prompt.targetAudience}`);
  console.log(`   💡 Benefit: ${prompt.mainBenefit}`);

  for (const section of sections) {
    console.log(`\n📝 Generating ${section} section...`);
    const sectionStartTime = Date.now();
    
    const result = await generateLPSection(section, prompt, 3); // 3回リトライ
    const sectionTime = Date.now() - sectionStartTime;
    
    if (result.success && result.content) {
      results[section] = result.content;
      console.log(`✅ ${section} section generated successfully (${sectionTime}ms)`);
      
      // 成功時の内容サマリーログ
      if (result.content.title) {
        console.log(`   📖 Title: "${result.content.title.substring(0, 50)}..."`);
      }
    } else {
      errors.push(`${section}: ${result.error || 'Unknown error'}`);
      console.error(`❌ Failed to generate ${section}: ${result.error}`);
    }

    // GPT-5の推論負荷を考慮したレート制限
    if (sections.indexOf(section) < sections.length - 1) {
      console.log(`   ⏳ Waiting 3 seconds before next section...`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  const totalTime = Date.now() - startTime;
  const successfulSections = Object.keys(results).length;
  const failedSections = sections.length - successfulSections;

  // 統計情報
  const stats = {
    totalSections: sections.length,
    successfulSections,
    failedSections,
    totalTime
  };

  if (successfulSections === 0) {
    console.log(`❌ Complete failure: 0/${sections.length} sections generated (${totalTime}ms)`);
    return { success: false, config: undefined, errors, stats };
  }

  // TemplateConfig形式に変換
  const config: Partial<TemplateConfig> = {
    meta: {
      title: `${prompt.serviceName} - ${results.hero?.title || 'サービスLP'}`,
      description: results.hero?.subtitle || prompt.serviceDescription,
      keywords: [prompt.serviceName, ...prompt.targetAudience.split(/[、,\s]+/)]
    },
    content: {
      hero: results.hero,
      problem: results.problem, 
      solution: results.solution,
      pricing: results.pricing,
      finalCta: results.cta,
      form: {
        title: "無料相談・お問い合わせ",
        subtitle: `${prompt.serviceName}について詳しく知りたい方はこちら`,
        fields: [
          {
            type: "text",
            name: "name", 
            label: "お名前",
            placeholder: "山田 太郎",
            required: true
          },
          {
            type: "email",
            name: "email",
            label: "メールアドレス", 
            placeholder: "example@company.com",
            required: true
          },
          {
            type: "textarea",
            name: "message",
            label: "お問い合わせ内容",
            placeholder: "ご質問やご相談内容をお聞かせください",
            required: false
          }
        ],
        submitText: "無料相談を申し込む",
        successMessage: "お問い合わせありがとうございます。24時間以内にご連絡いたします。"
      }
    }
  };

  console.log(`🎉 LP generation completed: ${successfulSections}/${sections.length} sections successful (${totalTime}ms)`);
  
  if (failedSections > 0) {
    console.warn(`⚠️  ${failedSections} sections failed:`, errors);
  }

  return {
    success: true,
    config,
    errors,
    stats
  };
}