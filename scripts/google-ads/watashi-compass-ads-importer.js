#!/usr/bin/env node

/**
 * わたしコンパス（2025-08-006-watashi-compass）のGoogle Ads実績を4時間ごとに集計し、Convexに投入
 */

const fs = require('fs');
const https = require('https');
const http = require('http');

// 設定
const PRODUCT_ID = 'WATASHI-COMPASS';
const WINDOW_HOURS = [0, 4, 8, 12, 16, 20];

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    mode: 'csv',
    csvFile: '',
    baseUrl: 'http://localhost:3000',
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--csv') {
      config.mode = 'csv';
      config.csvFile = args[++i];
    } else if (args[i] === '--base-url') {
      config.baseUrl = args[++i];
    } else if (args[i] === '--help') {
      console.log(`
わたしコンパス Google Ads 実績インポーター

使用方法:
  node watashi-compass-ads-importer.js --csv ads-report.csv --base-url http://localhost:3000
`);
      process.exit(0);
    }
  }

  return config;
}

function getWindowStartTimestamp(dateStr, hour) {
  const jstDate = new Date(`${dateStr}T${hour.toString().padStart(2, '0')}:00:00+09:00`);
  return jstDate.getTime();
}

function parseCSVData(csvContent) {
  console.log('📊 CSVデータを解析中...');
  
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');
  
  console.log(`   ヘッダー: ${headers.join(', ')}`);
  
  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length < headers.length) continue;
    
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index];
    });
    
    const normalized = {
      date: record['日付'] || record['Date'] || record['date'],
      hour: record['時間'] || record['Hour'] || record['hour'] || '0',
      impressions: parseInt(record['インプレッション'] || record['Impressions'] || '0'),
      clicks: parseInt(record['クリック'] || record['Clicks'] || '0'),
      cost: parseInt(record['費用'] || record['Cost'] || '0'),
      conversions: parseInt(record['コンバージョン'] || record['Conversions'] || '0'),
    };
    
    if (normalized.date && !isNaN(normalized.impressions)) {
      records.push(normalized);
    }
  }
  
  console.log(`   ${records.length}件のレコードを解析`);
  return records;
}

function aggregateToWindows(records) {
  console.log('🔄 4時間窓に集計中...');
  
  const windows = new Map();
  
  records.forEach(record => {
    const hour = parseInt(record.hour || '0');
    const windowHour = WINDOW_HOURS.find(w => hour >= w && hour < w + 4) || 0;
    const windowKey = `${record.date}:${windowHour}`;
    
    if (!windows.has(windowKey)) {
      windows.set(windowKey, {
        date: record.date,
        windowHour: windowHour,
        ts_start: getWindowStartTimestamp(record.date, windowHour),
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0,
      });
    }
    
    const window = windows.get(windowKey);
    window.impressions += record.impressions;
    window.clicks += record.clicks;
    window.cost += record.cost;
    window.conversions += record.conversions;
  });
  
  const aggregated = Array.from(windows.values()).sort((a, b) => a.ts_start - b.ts_start);
  
  console.log(`   ${aggregated.length}個の4時間窓に集計完了`);
  aggregated.forEach(w => {
    const date = new Date(w.ts_start);
    console.log(`   ${date.toLocaleString('ja-JP', {timeZone: 'Asia/Tokyo'})}: Imp=${w.impressions}, Clk=${w.clicks}, Cost=¥${w.cost}, Conv=${w.conversions}`);
  });
  
  return aggregated;
}

async function uploadToConvex(config, windowData) {
  console.log(`🚀 Convexに${windowData.length}個の窓データを投入中...`);
  
  const url = `${config.baseUrl}/api/positions/${PRODUCT_ID}/ads`;
  
  const payload = {
    mode: '4h',
    windowHours: 4,
    items: windowData.map(w => ({
      ts_start: w.ts_start,
      impressions: w.impressions,
      clicks: w.clicks,
      cost: w.cost,
      conversions: w.conversions,
    }))
  };
  
  try {
    const response = await postData(url, payload);
    console.log(`✅ 投入成功: ${response.count}件`);
  } catch (error) {
    console.error(`❌ 投入失敗: ${error.message}`);
    throw error;
  }
}

function postData(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };
    
    const req = (urlObj.protocol === 'https:' ? https : http).request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const result = JSON.parse(responseBody);
            resolve(result);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseBody}`));
          }
        } catch (parseError) {
          reject(new Error(`Parse error: ${parseError.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function verifyData(config) {
  console.log('🔍 投入データを検証中...');
  
  const url = `${config.baseUrl}/api/positions/${PRODUCT_ID}/ads?granularity=4h`;
  
  try {
    const response = await getData(url);
    console.log(`✅ 検証成功: ${response.ads.length}件の4時間窓データが確認されました`);
    
    response.ads.slice(0, 5).forEach(ad => {
      console.log(`   ${ad.date}: Imp=${ad.impressions}, Clk=${ad.clicks}, Cost=¥${ad.cost}, Conv=${ad.conversions}`);
    });
    
    if (response.ads.length > 5) {
      console.log(`   ... その他 ${response.ads.length - 5}件`);
    }
  } catch (error) {
    console.error(`❌ 検証失敗: ${error.message}`);
  }
}

function getData(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
    };
    
    const req = (urlObj.protocol === 'https:' ? https : http).request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const result = JSON.parse(responseBody);
            resolve(result);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${responseBody}`));
          }
        } catch (parseError) {
          reject(new Error(`Parse error: ${parseError.message}`));
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const config = parseArgs();
  
  console.log('🎯 わたしコンパス Google Ads 実績インポーター');
  console.log('='.repeat(50));
  console.log(`モード: ${config.mode}`);
  console.log(`ベースURL: ${config.baseUrl}`);
  console.log(`プロダクトID: ${PRODUCT_ID}`);
  
  try {
    if (config.mode === 'csv') {
      if (!config.csvFile || !fs.existsSync(config.csvFile)) {
        console.error('❌ CSVファイルが指定されていないか、存在しません');
        process.exit(1);
      }
      
      console.log(`📁 CSVファイル読み込み: ${config.csvFile}`);
      const csvContent = fs.readFileSync(config.csvFile, 'utf8');
      const rawData = parseCSVData(csvContent);
      
      if (rawData.length === 0) {
        console.log('⚠️ データが見つかりませんでした');
        return;
      }
      
      const windowData = aggregateToWindows(rawData);
      
      if (windowData.length === 0) {
        console.log('⚠️ 集計データがありません');
        return;
      }
      
      await uploadToConvex(config, windowData);
      
      await sleep(2000);
      await verifyData(config);
      
      console.log('\n🎉 完了！わたしコンパスのGoogle Ads実績がConvexに正常投入されました');
    }
    
  } catch (error) {
    console.error(`💥 エラー: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}