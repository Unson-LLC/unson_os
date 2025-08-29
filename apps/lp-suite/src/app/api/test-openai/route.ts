import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // OpenAI API キーの存在確認
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        configured: false,
        working: false,
        error: 'OPENAI_API_KEY環境変数が設定されていません'
      }, { status: 200 });
    }

    // APIキーの形式確認（基本的なバリデーション）
    if (!apiKey.startsWith('sk-')) {
      return NextResponse.json({
        configured: false,
        working: false,
        error: 'OpenAI APIキーの形式が正しくありません'
      }, { status: 200 });
    }

    // 実際のAPI接続テスト（軽量なリクエスト）
    try {
      const testResponse = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (testResponse.ok) {
        const models = await testResponse.json();
        const hasGPT4 = models.data?.some((model: any) => model.id.includes('gpt-4'));
        const hasGPT35 = models.data?.some((model: any) => model.id.includes('gpt-3.5'));

        return NextResponse.json({
          configured: true,
          working: true,
          models: {
            gpt4Available: hasGPT4,
            gpt35Available: hasGPT35,
            totalModels: models.data?.length || 0
          },
          message: 'OpenAI API接続成功'
        });
      } else {
        const error = await testResponse.text();
        return NextResponse.json({
          configured: true,
          working: false,
          error: `OpenAI API接続エラー: ${testResponse.status} - ${error}`
        }, { status: 200 });
      }
    } catch (apiError) {
      return NextResponse.json({
        configured: true,
        working: false,
        error: `OpenAI API接続失敗: ${apiError instanceof Error ? apiError.message : String(apiError)}`
      }, { status: 200 });
    }

  } catch (error) {
    console.error('OpenAI APIテストエラー:', error);
    return NextResponse.json({
      configured: false,
      working: false,
      error: `システムエラー: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 });
  }
}

export async function POST() {
  // より詳細なテスト（実際に小さなテキスト生成を実行）
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI APIキーが設定されていません'
      }, { status: 400 });
    }

    const testResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'テスト用の短いメッセージです。「OK」と返答してください。'
          }
        ],
        max_tokens: 10,
        temperature: 0
      })
    });

    if (testResponse.ok) {
      const result = await testResponse.json();
      const responseText = result.choices[0]?.message?.content?.trim() || '';

      return NextResponse.json({
        success: true,
        message: 'OpenAI API完全テスト成功',
        testResponse: responseText,
        usage: result.usage
      });
    } else {
      const error = await testResponse.text();
      return NextResponse.json({
        success: false,
        error: `OpenAI APIテスト失敗: ${testResponse.status} - ${error}`
      }, { status: 400 });
    }

  } catch (error) {
    console.error('OpenAI API詳細テストエラー:', error);
    return NextResponse.json({
      success: false,
      error: `テスト実行エラー: ${error instanceof Error ? error.message : String(error)}`
    }, { status: 500 });
  }
}