import { NextRequest, NextResponse } from 'next/server'
import chokidar from 'chokidar'
import path from 'path'

const configPath = path.join(process.cwd(), 'configs', 'config.json')

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode('data: {"type":"connected"}\n\n'))
      
      // Watch for config file changes
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