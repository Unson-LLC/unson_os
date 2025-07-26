import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ConvexHttpClient } from 'convex/browser'
// import { api } from '@/convex/_generated/api'

interface DiscordJoinRequest {
  email: string
  name: string
  reasons: string[]
  otherReason: string
  skills: string
  expectations: string
}

// 理由のラベルマッピング
const reasonLabels: Record<string, string> = {
  saas: 'SaaS開発に興味がある',
  ai: 'AI活用ビジネスに興味がある',
  dao: 'DAOコミュニティに興味がある',
  revenue: '収益分配モデルに興味がある',
  other: 'その他'
}

const resend = new Resend(process.env.RESEND_API_KEY)
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(request: NextRequest) {
  try {
    const body: DiscordJoinRequest = await request.json()
    
    // バリデーション
    if (!body.email || !body.name || !body.reasons.length || !body.expectations) {
      return NextResponse.json(
        { error: '必須項目が入力されていません' },
        { status: 400 }
      )
    }

    // 参加理由をフォーマット
    const formattedReasons = body.reasons.map(reason => {
      if (reason === 'other' && body.otherReason) {
        return `${reasonLabels[reason]}: ${body.otherReason}`
      }
      return reasonLabels[reason] || reason
    }).join('\n')

    // 現在の日時
    const now = new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })

    // TODO: Convexに保存
    // try {
    //   await convex.mutation(api.discordApplications.create, {
    //     email: body.email,
    //     name: body.name,
    //     reasons: body.reasons,
    //     otherReason: body.otherReason,
    //     skills: body.skills,
    //     expectations: body.expectations,
    //   })
    // } catch (error: any) {
    //   if (error.message?.includes('既に承認済み')) {
    //     return NextResponse.json(
    //       { error: '既に承認済みの申請があります。Discord招待リンクをメールでご確認ください。' },
    //       { status: 400 }
    //     )
    //   }
    //   throw error
    // }

    // メール送信データの準備
    const emailData = {
      to: body.email,
      subject: 'Unson OS Discordコミュニティへようこそ！',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a; margin-bottom: 24px;">Unson OS Discordコミュニティへようこそ！</h1>
          
          <p style="color: #4a4a4a; line-height: 1.6;">
            ${body.name}様<br><br>
            この度は、Unson OS Discordコミュニティへの参加申請をいただき、ありがとうございます。
          </p>

          <div style="background-color: #5865F2; color: white; padding: 24px; border-radius: 8px; margin: 24px 0;">
            <h2 style="margin-top: 0;">Discord参加方法</h2>
            <p>以下のボタンをクリックして、Discordサーバーに参加してください：</p>
            <a href="https://discord.gg/unsonos" style="display: inline-block; background-color: white; color: #5865F2; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 12px;">
              Discordに参加する
            </a>
          </div>

          <h3 style="color: #1a1a1a; margin-top: 32px;">参加後の流れ</h3>
          <ol style="color: #4a4a4a; line-height: 1.8;">
            <li>自己紹介チャンネルで簡単な自己紹介をお願いします</li>
            <li>興味のあるプロジェクトチャンネルに参加してください</li>
            <li>質問や提案は遠慮なくどうぞ！</li>
          </ol>

          <div style="background-color: #f0f0f0; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <h4 style="margin-top: 0; color: #1a1a1a;">コミュニティガイドライン</h4>
            <ul style="color: #4a4a4a; margin: 0; padding-left: 20px;">
              <li>お互いを尊重し、建設的な議論を心がけましょう</li>
              <li>スパムや宣伝行為は禁止です</li>
              <li>技術的な質問は関連チャンネルで行いましょう</li>
            </ul>
          </div>

          <p style="color: #4a4a4a; line-height: 1.6;">
            ご不明な点がございましたら、Discordの#supportチャンネルまたはこのメールに返信してお問い合わせください。
          </p>

          <p style="color: #4a4a4a; line-height: 1.6;">
            一緒にUnson OSの未来を創っていきましょう！
          </p>

          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 32px 0;">
          
          <p style="color: #888; font-size: 14px;">
            Unson OS Team<br>
            <a href="https://unson-os.com" style="color: #5865F2;">https://unson-os.com</a>
          </p>
        </div>
      `
    }

    // 管理者向け通知メールの準備
    const adminEmailData = {
      to: process.env.ADMIN_EMAIL || 'admin@unson-os.com',
      subject: `[Unson OS] 新規Discord参加申請: ${body.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>新規Discord参加申請</h2>
          <p><strong>申請日時:</strong> ${now}</p>
          
          <h3>申請者情報</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>名前:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${body.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>メール:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${body.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; vertical-align: top;"><strong>参加理由:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; white-space: pre-line;">${formattedReasons}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; vertical-align: top;"><strong>スキル・経験:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${body.skills || 'なし'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; vertical-align: top;"><strong>期待すること:</strong></td>
              <td style="padding: 8px;">${body.expectations}</td>
            </tr>
          </table>
        </div>
      `
    }

    // メール送信
    const discordInviteLink = process.env.DISCORD_INVITE_LINK || 'https://discord.gg/unsonos'
    
    // 申請者へのメール
    await resend.emails.send({
      from: 'Unson OS <noreply@unson-os.com>',
      to: body.email,
      subject: emailData.subject,
      html: emailData.html.replace('https://discord.gg/unsonos', discordInviteLink),
    })

    // 管理者への通知メール
    if (process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from: 'Unson OS <noreply@unson-os.com>',
        to: process.env.ADMIN_EMAIL,
        subject: adminEmailData.subject,
        html: adminEmailData.html,
      })
    }

    return NextResponse.json({ 
      success: true,
      message: '申請を受け付けました。メールをご確認ください。'
    })
    
  } catch (error) {
    console.error('Discord参加申請エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}