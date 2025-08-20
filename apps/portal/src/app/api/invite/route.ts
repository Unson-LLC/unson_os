import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { InviteEmail } from '@/components/emails/InviteEmail'
import { createDiscordInvite } from '@/utils/discord'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    // フォーム情報を取り出す
    const { email } = (await req.json()) as { email: string }
    if (!email) {
      return NextResponse.json({ error: 'email required' }, { status: 400 })
    }

    // Discord 招待リンク生成
    const inviteUrl = await createDiscordInvite()

    // Resend で送信
    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email,
      subject: 'Discord 招待リンクのご案内',
      react: InviteEmail({ inviteUrl }),
    })

    if (error) throw error

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}