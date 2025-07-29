import { NextResponse } from 'next/server'
import { createDiscordInvite } from '@/utils/discord'

export async function GET() {
  const envVars = {
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN ? '設定済み' : '未設定',
    DISCORD_CHANNEL_ID: process.env.DISCORD_CHANNEL_ID || '未設定',
    DISCORD_SERVER_ID: process.env.DISCORD_SERVER_ID || '未設定',
    DISCORD_INVITE_LINK: process.env.DISCORD_INVITE_LINK || '未設定',
    USE_NEW_EMAIL_TEMPLATE: process.env.USE_NEW_EMAIL_TEMPLATE || 'デフォルト(true)',
    NODE_ENV: process.env.NODE_ENV,
  }

  let discordInviteTest = {
    success: false,
    result: '',
    error: ''
  }

  try {
    const invite = await createDiscordInvite()
    discordInviteTest.success = true
    discordInviteTest.result = invite
  } catch (error: any) {
    discordInviteTest.error = error.message
  }

  // フォールバック値の確認
  const fallbackLink = process.env.DISCORD_INVITE_LINK || 'https://discord.gg/unsonos'

  return NextResponse.json({
    環境変数: envVars,
    Discord招待リンク生成テスト: discordInviteTest,
    フォールバックリンク: fallbackLink,
    現在時刻: new Date().toISOString()
  })
}