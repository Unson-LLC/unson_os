import React from 'react'
import { Html, Button, Text } from '@react-email/components'

export function InviteEmail({ inviteUrl }: { inviteUrl: string }) {
  return (
    <Html lang="ja">
      <Text>フォーム送信ありがとうございます！</Text>
      <Text>以下のボタンから 24 時間以内にサーバーへご参加ください。</Text>
      <Button href={inviteUrl}>Discord に参加する</Button>
      <Text style={{ fontSize: 12, color: '#888' }}>
        ※ 本リンクは 1 回限り有効です。
      </Text>
    </Html>
  )
}