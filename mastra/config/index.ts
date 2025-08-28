// Mastra統一設定（全マイクロSaaS共通）
import { Mastra } from '@mastra/core'
import { openai } from '@mastra/core'

export const mastraConfig = new Mastra({
  providers: {
    openai: openai({
      apiKey: process.env.OPENAI_API_KEY!,
      model: 'gpt-4o-mini'
    })
  },
  memory: {
    provider: 'upstash-redis', // またはメモリ内ストレージ
    config: {}
  }
})