import { NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function GET() {
  try {
    // API Key存在チェック
    if (!OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'OPENAI_API_KEYが設定されていません',
        configured: false
      });
    }

    // APIキー形式チェック
    if (!OPENAI_API_KEY.startsWith('sk-')) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI APIキーの形式が正しくありません',
        configured: true,
        validFormat: false
      });
    }

    console.log('🧪 Testing OpenAI API connection...');

    // 簡単なテストリクエスト
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-5',
        messages: [
          {
            role: 'system',
            content: 'あなたは日本のコピーライティング専門家です。'
          },
          {
            role: 'user',
            content: 'APIテストです。「テスト成功」と日本語で返答してください。'
          }
        ],
        max_completion_tokens: 10
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      // よくあるエラーの詳細解析
      let errorMessage = `API Error: ${response.status}`;
      if (errorData.error) {
        if (errorData.error.code === 'invalid_api_key') {
          errorMessage = 'APIキーが無効です。正しいOpenAI APIキーを設定してください。';
        } else if (errorData.error.code === 'insufficient_quota') {
          errorMessage = 'OpenAI APIの使用制限に達しています。';
        } else {
          errorMessage = errorData.error.message || errorMessage;
        }
      }

      return NextResponse.json({
        success: false,
        error: errorMessage,
        configured: true,
        validFormat: true,
        apiResponseStatus: response.status,
        details: errorData
      });
    }

    const data = await response.json();
    const testResponse = data.choices[0]?.message?.content || 'No response';

    console.log('✅ OpenAI API test successful');

    return NextResponse.json({
      success: true,
      configured: true,
      validFormat: true,
      testResponse,
      model: data.model,
      usage: data.usage,
      message: 'OpenAI API接続成功！'
    });

  } catch (error) {
    console.error('❌ OpenAI API test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      configured: !!OPENAI_API_KEY,
      details: 'ネットワークエラーまたはAPIサーバーの問題'
    });
  }
}