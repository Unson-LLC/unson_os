#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function checkVercelToken() {
  const token = process.env.VERCEL_TOKEN;
  
  if (!token) {
    console.error('❌ VERCEL_TOKENが設定されていません');
    return;
  }
  
  console.log('🔍 Vercelトークン情報を確認します...\n');
  
  try {
    // ユーザー情報を取得
    const userResponse = await fetch('https://api.vercel.com/www/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ ユーザー情報:');
      console.log(`ユーザー名: ${userData.user?.username || '不明'}`);
      console.log(`メール: ${userData.user?.email || '不明'}`);
      console.log('---');
    }
    
    // チーム情報を取得
    const teamsResponse = await fetch('https://api.vercel.com/v2/teams', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (teamsResponse.ok) {
      const teamsData = await teamsResponse.json();
      console.log('✅ アクセス可能なチーム:');
      if (teamsData.teams && teamsData.teams.length > 0) {
        teamsData.teams.forEach((team: any) => {
          console.log(`チーム名: ${team.name}`);
          console.log(`チームID: ${team.id}`);
          console.log(`スラッグ: ${team.slug}`);
          console.log('---');
        });
      } else {
        console.log('個人アカウントのみ');
      }
    }
    
    // プロジェクト一覧を取得
    const projectsResponse = await fetch('https://api.vercel.com/v9/projects', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json();
      console.log('\n✅ 既存のプロジェクト数:', projectsData.projects?.length || 0);
    } else {
      const error = await projectsResponse.text();
      console.log('\n⚠️ プロジェクト取得エラー:', error);
    }
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

checkVercelToken();