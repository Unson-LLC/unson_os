import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // テスト環境またはビルド時はファイル監視を無効化
  if (process.env.VITEST || process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production') {
    return new Response('data: {"type":"connected"}\n\n', {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  }

  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'))
      
      // 開発環境でのみファイル監視を有効化
      if (process.env.NODE_ENV === 'development') {
        const chokidar = require('chokidar')
        const path = require('path')
        const configPath = path.join(process.cwd(), 'configs', 'config.json')
        
        const watcher = chokidar.watch(configPath, {
          ignored: /(^|[\/\\])\../, // ignore dotfiles
          persistent: true
        })
        
        watcher.on('change', () => {
          try {
            controller.enqueue(encoder.encode('data: {"type":"fileChanged","timestamp":' + Date.now() + '}\n\n'))
          } catch (error) {
            console.error('Error sending file change event:', error)
          }
        })
        
        // Clean up on close
        request.signal.addEventListener('abort', () => {
          watcher.close()
          controller.close()
        })
      }
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  })
}