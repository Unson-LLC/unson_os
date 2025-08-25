#!/usr/bin/env tsx

import dotenv from 'dotenv';
import path from 'path';

// 環境変数を読み込み
dotenv.config({ path: path.join(__dirname, '../.env.local') });

async function checkVercelProjects() {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID;
  
  if (!token) {
    console.error('❌ VERCEL_TOKENが設定されていません');
    return;
  }
  
  console.log('🔍 Vercelプロジェクト一覧を確認します...\n');
  
  try {
    // プロジェクト一覧を取得
    const url = teamId 
      ? `https://api.vercel.com/v9/projects?teamId=${teamId}`
      : 'https://api.vercel.com/v9/projects';
      
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('❌ エラー:', error);
      return;
    }
    
    const data = await response.json();
    
    console.log(`📦 プロジェクト数: ${data.projects?.length || 0}\n`);
    
    if (data.projects && data.projects.length > 0) {
      // LP関連のプロジェクトを探す
      const lpProjects = data.projects.filter((p: any) => 
        p.name.includes('lp') || 
        p.name.includes('validation') ||
        p.name.includes('ai-') ||
        p.name.includes('mywa')
      );
      
      console.log('🎯 LP関連プロジェクト:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      lpProjects.forEach((project: any) => {
        console.log(`\n📌 ${project.name}`);
        console.log(`ID: ${project.id}`);
        console.log(`作成日: ${new Date(project.createdAt).toLocaleString('ja-JP')}`);
        
        // カスタムドメイン情報
        if (project.alias && project.alias.length > 0) {
          console.log('ドメイン:');
          project.alias.forEach((domain: string) => {
            console.log(`  • ${domain}`);
          });
        } else {
          console.log('ドメイン: 未設定');
        }
        
        // 最新のデプロイメント
        if (project.latestDeployments && project.latestDeployments.length > 0) {
          const latest = project.latestDeployments[0];
          console.log(`最新デプロイ: ${latest.url} (${latest.state})`);
        }
      });
      
      if (lpProjects.length === 0) {
        console.log('LP関連のプロジェクトが見つかりません');
      }
      
      console.log('\n\n📋 全プロジェクト名一覧:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      data.projects.forEach((p: any) => {
        console.log(`• ${p.name}`);
      });
    }
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

checkVercelProjects();