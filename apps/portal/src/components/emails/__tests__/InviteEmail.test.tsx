import React from 'react'
import { render } from '@testing-library/react'
import { InviteEmail } from '../InviteEmail'

describe('InviteEmail', () => {
  it('招待URLを含むメールテンプレートがレンダリングされること', () => {
    const inviteUrl = 'https://discord.gg/test123'
    const { container } = render(<InviteEmail inviteUrl={inviteUrl} />)
    
    // HTMLタグが存在することを確認
    const htmlElement = container.querySelector('html')
    expect(htmlElement).toBeInTheDocument()
    expect(htmlElement).toHaveAttribute('lang', 'ja')
  })

  it('必要なテキスト要素が含まれていること', () => {
    const inviteUrl = 'https://discord.gg/test123'
    const { getByText } = render(<InviteEmail inviteUrl={inviteUrl} />)
    
    expect(getByText('フォーム送信ありがとうございます！')).toBeInTheDocument()
    expect(getByText('以下のボタンから 24 時間以内にサーバーへご参加ください。')).toBeInTheDocument()
    expect(getByText('※ 本リンクは 1 回限り有効です。')).toBeInTheDocument()
  })

  it('Discordに参加するボタンが正しいURLを持つこと', () => {
    const inviteUrl = 'https://discord.gg/test123'
    const { getByText } = render(<InviteEmail inviteUrl={inviteUrl} />)
    
    const button = getByText('Discord に参加する').closest('a')
    expect(button).toHaveAttribute('href', inviteUrl)
  })

  it('注釈テキストが適切なスタイルを持つこと', () => {
    const inviteUrl = 'https://discord.gg/test123'
    const { getByText } = render(<InviteEmail inviteUrl={inviteUrl} />)
    
    const noteText = getByText('※ 本リンクは 1 回限り有効です。')
    expect(noteText).toHaveStyle({
      fontSize: '12px',
      color: '#888'
    })
  })
})