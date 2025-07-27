import { NextRequest, NextResponse } from 'next/server'

interface GitHubContributor {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
  type: string
}

export async function GET(request: NextRequest) {
  try {
    const repoOwner = 'Unson-LLC'
    const repoName = 'unson_os'
    
    // GitHub APIからコントリビューター情報を取得
    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'Unson-OS-Website',
          // GitHub TokenがあればRate Limitを増やせる
          ...(process.env.GITHUB_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
          })
        },
        // キャッシュ設定（5分間）
        next: {
          revalidate: 300
        }
      }
    )

    if (!response.ok) {
      if (response.status === 403) {
        // Rate limit exceeded の場合
        console.warn('GitHub API rate limit exceeded')
        return NextResponse.json(
          { 
            error: 'GitHub API rate limit exceeded',
            fallback: true,
            data: getFallbackContributors()
          },
          { 
            status: 200,
            headers: {
              'Cache-Control': 'public, s-maxage=60'
            }
          }
        )
      }
      
      if (response.status === 404) {
        console.warn('Repository not found')
        return NextResponse.json(
          { 
            error: 'Repository not found',
            fallback: true,
            data: getFallbackContributors()
          },
          { 
            status: 200,
            headers: {
              'Cache-Control': 'public, s-maxage=60'
            }
          }
        )
      }
      
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const contributors: GitHubContributor[] = await response.json()
    
    // Botアカウントなどを除外
    const filteredContributors = contributors.filter(
      contributor => contributor.type === 'User'
    )

    return NextResponse.json(filteredContributors, {
      headers: {
        'Cache-Control': 'public, s-maxage=300' // 5分間キャッシュ
      }
    })
    
  } catch (error) {
    console.error('GitHub contributors API error:', error)
    
    // エラーの場合はフォールバックデータを返す
    return NextResponse.json(getFallbackContributors(), {
      headers: {
        'Cache-Control': 'public, s-maxage=60' // 1分間キャッシュ
      }
    })
  }
}

// フォールバックデータ（GitHub APIが利用できない場合）
function getFallbackContributors(): GitHubContributor[] {
  return [
    {
      id: 1,
      login: 'ksato',
      avatar_url: 'https://github.com/ksato.png',
      html_url: 'https://github.com/ksato',
      contributions: 45,
      type: 'User'
    },
    {
      id: 2,
      login: 'claude-code',
      avatar_url: 'https://avatars.githubusercontent.com/u/100000000?v=4',
      html_url: 'https://github.com/claude-code',
      contributions: 32,
      type: 'User'
    },
    {
      id: 3,
      login: 'unson-contributor',
      avatar_url: 'https://avatars.githubusercontent.com/u/100000001?v=4',
      html_url: 'https://github.com/unson-contributor',
      contributions: 18,
      type: 'User'
    },
    {
      id: 4,
      login: 'community-dev',
      avatar_url: 'https://avatars.githubusercontent.com/u/100000002?v=4',
      html_url: 'https://github.com/community-dev',
      contributions: 12,
      type: 'User'
    }
  ]
}