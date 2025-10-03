import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { ConvexHttpClient } from 'convex/browser'
import { createDiscordInvite } from '@/utils/discord'
import { InviteEmail } from '@/components/emails/InviteEmail'
import { api } from '@/convex/_generated/api'

interface DiscordJoinRequest {
  email: string
  name: string
  reasons: string[]
  otherReason: string
  skills: string
  expectations: string
  // 新しいペルソナ関連フィールド
  occupation?: string
  experienceLevel?: string
  currentRole?: string
  interests?: string[]
  motivations?: string[]
  timeCommitment?: string
  learningGoals?: string[]
  contributionAreas?: string[]
}

// 理由のラベルマッピング
const reasonLabels: Record<string, string> = {
  saas: 'SaaS開発に興味がある',
  ai: 'AI活用ビジネスに興味がある',
  dao: 'DAOコミュニティに興味がある',
  revenue: '収益分配モデルに興味がある',
  other: 'その他'
}

// 新しいフィールドのラベルマッピング
const occupationLabels: Record<string, string> = {
  engineer: 'エンジニア・開発者',
  designer: 'デザイナー',
  marketer: 'マーケター・営業',
  pm: 'プロダクトマネージャー',
  executive: '経営者・起業家',
  student: '学生',
  other_job: 'その他の職業'
}

const experienceLabels: Record<string, string> = {
  student: '学生・未経験',
  junior: '1-3年',
  mid: '3-7年',
  senior: '7年以上'
}

const interestLabels: Record<string, string> = {
  technical: '技術・開発',
  business: 'ビジネス・戦略',
  design: 'デザイン・UX',
  marketing: 'マーケティング',
  investment: '投資・資金調達',
  community: 'コミュニティ運営',
  education: '教育・メンタリング'
}

const motivationLabels: Record<string, string> = {
  learn: '新しいスキルを学びたい',
  network: '人脈を広げたい',
  contribute: 'プロジェクトに貢献したい',
  earn: '収益を得たい',
  challenge: '新しい挑戦をしたい'
}

const timeCommitmentLabels: Record<string, string> = {
  undecided: '未定（まずはコミュニティの様子を見たい）',
  casual: '週1-2時間（カジュアル参加）',
  regular: '週3-5時間（定期的参加）',
  active: '週6-10時間（積極的参加）',
  dedicated: '週10時間以上（本格参加）'
}

const resend = new Resend(process.env.RESEND_API_KEY)
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@unson.jp'

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

    // Discord Bot APIで動的に招待リンクを生成
    let discordInviteLink: string
    try {
      // 環境変数の確認
      console.log('Discord環境変数チェック:', {
        hasToken: !!process.env.DISCORD_BOT_TOKEN,
        tokenFirst5: process.env.DISCORD_BOT_TOKEN?.substring(0, 5),
        hasChannelId: !!process.env.DISCORD_CHANNEL_ID,
        channelId: process.env.DISCORD_CHANNEL_ID,
        hasServerId: !!process.env.DISCORD_SERVER_ID,
        serverId: process.env.DISCORD_SERVER_ID,
        nodeEnv: process.env.NODE_ENV,
        // 環境変数の再デプロイトリガー - Vercelダッシュボードで手動設定後
        deployTime: new Date().toISOString()
      })
      
      if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_CHANNEL_ID) {
        console.error('Discord環境変数が未設定:', {
          hasToken: !!process.env.DISCORD_BOT_TOKEN,
          hasChannelId: !!process.env.DISCORD_CHANNEL_ID
        })
        throw new Error('Discord configuration missing')
      }
      
      discordInviteLink = await createDiscordInvite()
      console.log('生成された招待リンク:', discordInviteLink)
    } catch (error) {
      console.error('Discord招待リンク生成エラー:', error)
      // Bot APIが失敗した場合はエラーを返す
      return NextResponse.json(
        { error: 'Discord招待リンクの生成に失敗しました。時間をおいて再度お試しください。' },
        { status: 500 }
      )
    }
    
    // Discord Server ID（ウィジェット用）
    const discordServerId = process.env.DISCORD_SERVER_ID || '1234567890123456789'

    // Convexに保存
    try {
      await convex.mutation(api.discordApplications.create, {
        email: body.email,
        name: body.name,
        reasons: body.reasons,
        otherReason: body.otherReason,
        skills: body.skills,
        expectations: body.expectations,
      })
    } catch (error: any) {
      if (error.message?.includes('既に承認済み')) {
        return NextResponse.json(
          { error: '既に承認済みの申請があります。Discord招待リンクをメールでご確認ください。' },
          { status: 400 }
        )
      }
      throw error
    }

    // 新しいReact Emailテンプレートを使用する場合
    const useNewTemplate = process.env.USE_NEW_EMAIL_TEMPLATE !== 'false' // デフォルトでtrue
    console.log('テンプレート設定:', {
      USE_NEW_EMAIL_TEMPLATE: process.env.USE_NEW_EMAIL_TEMPLATE,
      useNewTemplate
    })
    
    // メール送信データの準備
    console.log('メール送信準備:', {
      useNewTemplate,
      discordInviteLink,
      email: body.email
    })
    
    const emailData = useNewTemplate ? {
      to: body.email,
      subject: 'Discord 招待リンクのご案内',
      react: InviteEmail({ inviteUrl: discordInviteLink }),
    } : {
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
            <a href="${discordInviteLink}" style="display: inline-block; background-color: white; color: #5865F2; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; margin-top: 12px;">
              Discordに参加する
            </a>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <h3 style="margin-top: 0;">または、以下のウィジェットから直接参加：</h3>
            <iframe src="https://discord.com/widget?id=${discordServerId}&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts" style="border-radius: 8px; display: block; margin: 0 auto;"></iframe>
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

    // 新しいフィールドのフォーマット
    const formatArrayField = (field: string[] | undefined, labels: Record<string, string>) => {
      return field?.map(item => labels[item] || item).join('、') || 'なし'
    }

    // 管理者向け通知メールの準備
    const adminEmailData = {
      to: process.env.ADMIN_EMAIL || 'admin@unson.jp',
      subject: `[Unson OS] 新規Discord参加申請: ${body.name} (${occupationLabels[body.occupation || ''] || '職業未記入'})`,
      html: `
        <div style="font-family: sans-serif; max-width: 800px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">新規Discord参加申請</h2>
          <p><strong>申請日時:</strong> ${now}</p>
          
          <div style="display: grid; gap: 24px;">
            <div>
              <h3 style="color: #3b82f6; margin-bottom: 12px;">🧑‍💼 基本情報</h3>
              <table style="width: 100%; border-collapse: collapse; background: #f8fafc; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; background: #f1f5f9; font-weight: bold; width: 30%;">名前</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${body.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; background: #f1f5f9; font-weight: bold;">メール</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${body.email}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; background: #f1f5f9; font-weight: bold;">職業</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${occupationLabels[body.occupation || ''] || 'なし'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; background: #f1f5f9; font-weight: bold;">実務経験</td>
                  <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${experienceLabels[body.experienceLevel || ''] || 'なし'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #f1f5f9; font-weight: bold;">現在の役割</td>
                  <td style="padding: 12px;">${body.currentRole || 'なし'}</td>
                </tr>
              </table>
            </div>

            <div>
              <h3 style="color: #10b981; margin-bottom: 12px;">💡 興味・動機</h3>
              <table style="width: 100%; border-collapse: collapse; background: #f0fdf4; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #bbf7d0; background: #dcfce7; font-weight: bold; width: 30%;">参加理由</td>
                  <td style="padding: 12px; border-bottom: 1px solid #bbf7d0; white-space: pre-line;">${formattedReasons}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #bbf7d0; background: #dcfce7; font-weight: bold;">興味分野</td>
                  <td style="padding: 12px; border-bottom: 1px solid #bbf7d0;">${formatArrayField(body.interests, interestLabels)}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #dcfce7; font-weight: bold;">参加動機</td>
                  <td style="padding: 12px;">${formatArrayField(body.motivations, motivationLabels)}</td>
                </tr>
              </table>
            </div>

            <div>
              <h3 style="color: #f59e0b; margin-bottom: 12px;">⏰ 参加詳細</h3>
              <table style="width: 100%; border-collapse: collapse; background: #fffbeb; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #fde68a; background: #fef3c7; font-weight: bold; width: 30%;">時間コミット</td>
                  <td style="padding: 12px; border-bottom: 1px solid #fde68a;">${timeCommitmentLabels[body.timeCommitment || ''] || 'なし'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #fde68a; background: #fef3c7; font-weight: bold; vertical-align: top;">スキル・経験</td>
                  <td style="padding: 12px; border-bottom: 1px solid #fde68a;">${body.skills || 'なし'}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background: #fef3c7; font-weight: bold; vertical-align: top;">期待すること</td>
                  <td style="padding: 12px;">${body.expectations}</td>
                </tr>
              </table>
            </div>
          </div>

          <div style="margin-top: 24px; padding: 16px; background: #eff6ff; border-radius: 8px; border-left: 4px solid #3b82f6;">
            <h4 style="margin: 0 0 8px 0; color: #1e40af;">💬 管理者メモ</h4>
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              この申請者は「${occupationLabels[body.occupation || '']}」で「${experienceLabels[body.experienceLevel || '']}」レベル。
              「${formatArrayField(body.interests, interestLabels)}」に興味があり、
              「${timeCommitmentLabels[body.timeCommitment || '']}」で参加予定。
            </p>
          </div>
        </div>
      `
    }

    // メール送信
    
    // 申請者へのメール
    if (useNewTemplate) {
      await resend.emails.send({
        from: `Unson OS <${fromEmail}>`,
        ...emailData
      })
    } else {
      await resend.emails.send({
        from: `Unson OS <${fromEmail}>`,
        to: body.email,
        subject: emailData.subject,
        html: emailData.html?.replace('https://discord.gg/ubDYjDVC', discordInviteLink) || '',
      })
    }

    // 管理者への通知メール
    if (process.env.ADMIN_EMAIL) {
      await resend.emails.send({
        from: `Unson OS <${fromEmail}>`,
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