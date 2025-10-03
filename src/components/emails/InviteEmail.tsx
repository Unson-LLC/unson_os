import React from 'react'
import { Html, Button, Text, Container, Section, Link } from '@react-email/components'

export function InviteEmail({ inviteUrl }: { inviteUrl: string }) {
  return (
    <Html lang="ja">
      <Container style={{ fontFamily: 'sans-serif', padding: '20px' }}>
        <Section>
          <Text style={{ fontSize: '16px', color: '#333' }}>
            フォーム送信ありがとうございます！
          </Text>
          <Text style={{ fontSize: '16px', color: '#333' }}>
            以下のボタンから 24 時間以内にサーバーへご参加ください。
          </Text>
          
          <Section style={{ textAlign: 'center', margin: '30px 0' }}>
            <Button 
              href={inviteUrl}
              style={{
                backgroundColor: '#5865F2',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: 'bold'
              }}
            >
              Discord に参加する
            </Button>
          </Section>
          
          <Text style={{ fontSize: '14px', color: '#666', marginTop: '20px' }}>
            ボタンが機能しない場合は、以下のリンクをコピーしてブラウザに貼り付けてください：
          </Text>
          <Link href={inviteUrl} style={{ fontSize: '14px', color: '#5865F2', wordBreak: 'break-all' }}>
            {inviteUrl}
          </Link>
          
          <Text style={{ fontSize: '12px', color: '#888', marginTop: '30px' }}>
            ※ 本リンクは 1 回限り有効です。
          </Text>
        </Section>
      </Container>
    </Html>
  )
}