#!/usr/bin/env node

// Discord Bot APIのテストスクリプト
async function testDiscordBotAPI() {
  const botToken = process.env.DISCORD_BOT_TOKEN
  const channelId = process.env.DISCORD_CHANNEL_ID

  console.log('環境変数チェック:')
  console.log('- DISCORD_BOT_TOKEN:', botToken ? `設定済み (${botToken.substring(0, 10)}...)` : '未設定')
  console.log('- DISCORD_CHANNEL_ID:', channelId || '未設定')

  if (!botToken || !channelId) {
    console.error('❌ 必要な環境変数が設定されていません')
    process.exit(1)
  }

  console.log('\nDiscord API呼び出しテスト:')
  
  try {
    const res = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/invites`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_uses: 1,
          max_age: 86400, // 24時間
          unique: true,
        }),
      }
    )

    console.log('- ステータスコード:', res.status)
    
    const responseText = await res.text()
    console.log('- レスポンス:', responseText)

    if (res.ok) {
      const data = JSON.parse(responseText)
      console.log('\n✅ 成功！招待リンク:', `https://discord.gg/${data.code}`)
    } else {
      console.error('\n❌ エラー:', res.status, responseText)
      
      // エラーの詳細を解析
      try {
        const error = JSON.parse(responseText)
        if (error.code === 50001) {
          console.error('→ ボットにチャンネルへのアクセス権限がありません')
        } else if (error.code === 10003) {
          console.error('→ チャンネルが見つかりません')
        } else if (error.code === 401) {
          console.error('→ ボットトークンが無効です')
        }
      } catch (e) {
        // JSONパースエラーは無視
      }
    }
  } catch (error) {
    console.error('\n❌ ネットワークエラー:', error.message)
  }
}

testDiscordBotAPI()