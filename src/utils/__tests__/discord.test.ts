import { createDiscordInvite } from '../discord'

// fetchのモック
global.fetch = jest.fn()

describe('createDiscordInvite', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
  
  beforeEach(() => {
    jest.clearAllMocks()
    // 環境変数のモック
    process.env.DISCORD_BOT_TOKEN = 'test-bot-token'
    process.env.DISCORD_CHANNEL_ID = 'test-channel-id'
  })

  it('正常に招待URLを生成できること', async () => {
    const mockInviteUrl = 'https://discord.gg/abc123'
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        code: 'abc123', 
        url: mockInviteUrl 
      })
    } as Response)

    const result = await createDiscordInvite()

    expect(result).toBe(mockInviteUrl)
    expect(mockFetch).toHaveBeenCalledWith(
      'https://discord.com/api/v11/channels/test-channel-id/invites',
      {
        method: 'POST',
        headers: {
          'Authorization': 'Bot test-bot-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_uses: 1,
          max_age: 86400, // 24時間
          unique: true,
        }),
      }
    )
  })

  it('Discord APIがエラーを返した場合、エラーをスローすること', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => 'Discord API Error'
    } as Response)

    await expect(createDiscordInvite()).rejects.toThrow(
      'Discord invite failed: Discord API Error'
    )
  })

  it('環境変数が設定されていない場合、エラーをスローすること', async () => {
    delete process.env.DISCORD_BOT_TOKEN
    delete process.env.DISCORD_CHANNEL_ID

    await expect(createDiscordInvite()).rejects.toThrow(
      'Discord configuration missing'
    )
  })

  it('ネットワークエラーの場合、エラーが伝播すること', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    await expect(createDiscordInvite()).rejects.toThrow('Network error')
  })
})