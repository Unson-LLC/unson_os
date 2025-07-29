export async function createDiscordInvite(): Promise<string> {
  const botToken = process.env.DISCORD_BOT_TOKEN
  const channelId = process.env.DISCORD_CHANNEL_ID

  if (!botToken || !channelId) {
    throw new Error('Discord configuration missing')
  }

  const res = await fetch(
    `https://discord.com/api/v11/channels/${channelId}/invites`,
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

  if (!res.ok) {
    throw new Error(`Discord invite failed: ${await res.text()}`)
  }
  
  const data = await res.json()
  return data.url as string
}