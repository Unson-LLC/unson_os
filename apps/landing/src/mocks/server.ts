import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Node.js環境用のMSWサーバー設定
export const server = setupServer(...handlers)