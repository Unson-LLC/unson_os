// Mastra統一設定（全マイクロSaaS共通）
import { Mastra } from '@mastra/core'
import { openai } from '@ai-sdk/openai'

export const mastraConfig = new Mastra()

// OpenAI モデルの設定（最新のMastra API形式）
export const openaiModel = openai('gpt-4o-mini')