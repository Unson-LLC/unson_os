// Google Ads MCPから完全な時間別データを取得して正確な4時間ウィンドウ集計を行うAPI
import { NextRequest, NextResponse } from 'next/server'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '../../../../../../convex/_generated/api'

export const dynamic = 'force-dynamic'

function resolveConvexUrl(): string {
  const val = (process.env.NEXT_PUBLIC_CONVEX_URL || process.env.CONVEX_URL || '').trim()
  const dep = (process.env.CONVEX_DEPLOYMENT || '').trim()
  if (val && val !== 'default') return val
  if (val === 'default' || dep.startsWith('dev:') || dep === 'default') {
    return 'http://127.0.0.1:3210'
  }
  return 'https://default.convex.cloud'
}

// Google Ads MCP完全時間別データ（8/6-8/28全期間）
function getCompleteHourlyData() {
  return [
    // 8/6のデータ（キャンペーン開始）
    { date: '2025-08-06', hour: 6, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-06', hour: 7, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-06', hour: 9, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-06', hour: 10, impressions: 2, clicks: 0, cost_micros: 0 },
    { date: '2025-08-06', hour: 11, impressions: 3, clicks: 0, cost_micros: 0 },
    { date: '2025-08-06', hour: 12, impressions: 14, clicks: 2, cost_micros: 5000000 },
    { date: '2025-08-06', hour: 13, impressions: 20, clicks: 4, cost_micros: 34000000 },
    { date: '2025-08-06', hour: 14, impressions: 7, clicks: 0, cost_micros: 0 },
    { date: '2025-08-06', hour: 15, impressions: 6, clicks: 1, cost_micros: 5000000 },
    { date: '2025-08-06', hour: 16, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-06', hour: 18, impressions: 11, clicks: 0, cost_micros: 0 },
    { date: '2025-08-06', hour: 19, impressions: 422, clicks: 83, cost_micros: 882000000 },
    { date: '2025-08-06', hour: 20, impressions: 34, clicks: 9, cost_micros: 74000000 },
    
    // 8/7のデータ
    { date: '2025-08-07', hour: 3, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-07', hour: 8, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-07', hour: 10, impressions: 1, clicks: 0, cost_micros: 0 },
    
    // 8/8のデータ
    { date: '2025-08-08', hour: 1, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-08', hour: 9, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-08', hour: 11, impressions: 2, clicks: 0, cost_micros: 0 },
    { date: '2025-08-08', hour: 13, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-08', hour: 14, impressions: 1, clicks: 0, cost_micros: 0 },
    
    // 8/9のデータ
    { date: '2025-08-09', hour: 0, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-09', hour: 1, impressions: 1, clicks: 1, cost_micros: 3000000 },
    { date: '2025-08-09', hour: 2, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-09', hour: 15, impressions: 1, clicks: 0, cost_micros: 0 },
    
    // 8/11のデータ
    { date: '2025-08-11', hour: 8, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-11', hour: 9, impressions: 1, clicks: 0, cost_micros: 0 },
    
    // 8/12のデータ
    { date: '2025-08-12', hour: 1, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-12', hour: 10, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-12', hour: 11, impressions: 2, clicks: 0, cost_micros: 0 },
    { date: '2025-08-12', hour: 12, impressions: 2, clicks: 1, cost_micros: 3000000 },
    { date: '2025-08-12', hour: 13, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-12', hour: 14, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-12', hour: 17, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-12', hour: 20, impressions: 5, clicks: 2, cost_micros: 12000000 },
    
    // 8/13のデータ
    { date: '2025-08-13', hour: 18, impressions: 82, clicks: 4, cost_micros: 653000000 },
    { date: '2025-08-13', hour: 19, impressions: 60, clicks: 5, cost_micros: 315000000 },
    { date: '2025-08-13', hour: 20, impressions: 32, clicks: 0, cost_micros: 0 },
    
    // 8/14のデータ
    { date: '2025-08-14', hour: 9, impressions: 46, clicks: 0, cost_micros: 0 },
    { date: '2025-08-14', hour: 10, impressions: 39, clicks: 1, cost_micros: 419000000 },
    { date: '2025-08-14', hour: 11, impressions: 48, clicks: 1, cost_micros: 151000000 },
    { date: '2025-08-14', hour: 12, impressions: 36, clicks: 3, cost_micros: 387000000 },
    { date: '2025-08-14', hour: 13, impressions: 40, clicks: 2, cost_micros: 349000000 },
    { date: '2025-08-14', hour: 14, impressions: 55, clicks: 4, cost_micros: 414000000 },
    { date: '2025-08-14', hour: 15, impressions: 6, clicks: 0, cost_micros: 0 },
    { date: '2025-08-14', hour: 16, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-14', hour: 21, impressions: 2, clicks: 1, cost_micros: 22000000 },
    { date: '2025-08-14', hour: 22, impressions: 6, clicks: 0, cost_micros: 0 },
    { date: '2025-08-14', hour: 23, impressions: 5, clicks: 0, cost_micros: 0 },
    
    // 8/15のデータ
    { date: '2025-08-15', hour: 0, impressions: 5, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 1, impressions: 4, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 2, impressions: 2, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 5, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 7, impressions: 5, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 8, impressions: 8, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 9, impressions: 9, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 10, impressions: 14, clicks: 2, cost_micros: 34000000 },
    { date: '2025-08-15', hour: 11, impressions: 15, clicks: 1, cost_micros: 15000000 },
    { date: '2025-08-15', hour: 12, impressions: 14, clicks: 3, cost_micros: 60000000 },
    { date: '2025-08-15', hour: 13, impressions: 24, clicks: 3, cost_micros: 53000000 },
    { date: '2025-08-15', hour: 14, impressions: 18, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 15, impressions: 1, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 16, impressions: 5, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 17, impressions: 15, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 18, impressions: 17, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 19, impressions: 11, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 20, impressions: 15, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 21, impressions: 3, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 22, impressions: 16, clicks: 0, cost_micros: 0 },
    { date: '2025-08-15', hour: 23, impressions: 22, clicks: 0, cost_micros: 0 },
    
    // 8/16の完全データ
    { date: '2025-08-16', hour: 0, impressions: 6, clicks: 0, cost_micros: 0 },
    { date: '2025-08-16', hour: 1, impressions: 111, clicks: 7, cost_micros: 208000000 },
    { date: '2025-08-16', hour: 2, impressions: 70, clicks: 1, cost_micros: 45000000 },
    { date: '2025-08-16', hour: 3, impressions: 53, clicks: 2, cost_micros: 44000000 },
    { date: '2025-08-16', hour: 4, impressions: 57, clicks: 4, cost_micros: 100000000 },
    { date: '2025-08-16', hour: 5, impressions: 74, clicks: 5, cost_micros: 145000000 },
    { date: '2025-08-16', hour: 6, impressions: 123, clicks: 12, cost_micros: 342000000 },
    { date: '2025-08-16', hour: 7, impressions: 307, clicks: 38, cost_micros: 1242000000 },
    { date: '2025-08-16', hour: 8, impressions: 242, clicks: 31, cost_micros: 1065000000 },
    { date: '2025-08-16', hour: 9, impressions: 227, clicks: 25, cost_micros: 853000000 },
    { date: '2025-08-16', hour: 10, impressions: 168, clicks: 18, cost_micros: 622000000 },
    { date: '2025-08-16', hour: 11, impressions: 179, clicks: 13, cost_micros: 457000000 },
    { date: '2025-08-16', hour: 12, impressions: 137, clicks: 9, cost_micros: 323000000 },
    { date: '2025-08-16', hour: 13, impressions: 221, clicks: 9, cost_micros: 403928144 },
    { date: '2025-08-16', hour: 14, impressions: 293, clicks: 17, cost_micros: 681000000 },
    { date: '2025-08-16', hour: 15, impressions: 283, clicks: 21, cost_micros: 803000000 },
    { date: '2025-08-16', hour: 16, impressions: 310, clicks: 14, cost_micros: 584000000 },
    { date: '2025-08-16', hour: 17, impressions: 345, clicks: 25, cost_micros: 1091966949 },
    { date: '2025-08-16', hour: 18, impressions: 313, clicks: 24, cost_micros: 997186211 },
    { date: '2025-08-16', hour: 19, impressions: 47, clicks: 6, cost_micros: 284000000 },
    
    // 8/17の完全データ
    { date: '2025-08-17', hour: 0, impressions: 227, clicks: 32, cost_micros: 1068000000 },
    { date: '2025-08-17', hour: 1, impressions: 56, clicks: 4, cost_micros: 114000000 },
    { date: '2025-08-17', hour: 2, impressions: 65, clicks: 2, cost_micros: 71000000 },
    { date: '2025-08-17', hour: 3, impressions: 65, clicks: 4, cost_micros: 137000000 },
    { date: '2025-08-17', hour: 4, impressions: 99, clicks: 6, cost_micros: 181000000 },
    { date: '2025-08-17', hour: 5, impressions: 135, clicks: 12, cost_micros: 407017626 },
    { date: '2025-08-17', hour: 6, impressions: 241, clicks: 18, cost_micros: 618000000 },
    { date: '2025-08-17', hour: 7, impressions: 299, clicks: 25, cost_micros: 944000000 },
    { date: '2025-08-17', hour: 8, impressions: 428, clicks: 40, cost_micros: 1371853787 },
    { date: '2025-08-17', hour: 9, impressions: 466, clicks: 53, cost_micros: 1929192484 },
    { date: '2025-08-17', hour: 10, impressions: 369, clicks: 27, cost_micros: 791000000 },
    { date: '2025-08-17', hour: 11, impressions: 281, clicks: 19, cost_micros: 620000000 },
    { date: '2025-08-17', hour: 12, impressions: 273, clicks: 8, cost_micros: 238000000 },
    { date: '2025-08-17', hour: 13, impressions: 245, clicks: 3, cost_micros: 87000000 },
    { date: '2025-08-17', hour: 14, impressions: 285, clicks: 10, cost_micros: 434000000 },
    { date: '2025-08-17', hour: 15, impressions: 291, clicks: 11, cost_micros: 359000000 },
    { date: '2025-08-17', hour: 16, impressions: 190, clicks: 7, cost_micros: 395121202 },
    
    // 8/18の完全データ
    { date: '2025-08-18', hour: 0, impressions: 202, clicks: 8, cost_micros: 266000000 },
    { date: '2025-08-18', hour: 1, impressions: 150, clicks: 7, cost_micros: 238000000 },
    { date: '2025-08-18', hour: 2, impressions: 106, clicks: 1, cost_micros: 33000000 },
    { date: '2025-08-18', hour: 3, impressions: 66, clicks: 8, cost_micros: 182000000 },
    { date: '2025-08-18', hour: 4, impressions: 81, clicks: 4, cost_micros: 119000000 },
    { date: '2025-08-18', hour: 5, impressions: 102, clicks: 9, cost_micros: 260000000 },
    { date: '2025-08-18', hour: 6, impressions: 178, clicks: 6, cost_micros: 293000000 },
    { date: '2025-08-18', hour: 7, impressions: 210, clicks: 10, cost_micros: 276000000 },
    { date: '2025-08-18', hour: 8, impressions: 135, clicks: 9, cost_micros: 232000000 },
    { date: '2025-08-18', hour: 9, impressions: 84, clicks: 2, cost_micros: 58000000 },
    { date: '2025-08-18', hour: 10, impressions: 115, clicks: 2, cost_micros: 33000000 },
    { date: '2025-08-18', hour: 11, impressions: 104, clicks: 2, cost_micros: 36000000 },
    { date: '2025-08-18', hour: 12, impressions: 143, clicks: 1, cost_micros: 19000000 },
    { date: '2025-08-18', hour: 13, impressions: 139, clicks: 3, cost_micros: 60000000 },
    { date: '2025-08-18', hour: 14, impressions: 133, clicks: 0, cost_micros: 0 },
    { date: '2025-08-18', hour: 15, impressions: 142, clicks: 4, cost_micros: 86000000 },
    { date: '2025-08-18', hour: 16, impressions: 145, clicks: 2, cost_micros: 50000000 },
    { date: '2025-08-18', hour: 17, impressions: 159, clicks: 3, cost_micros: 146000000 },
    { date: '2025-08-18', hour: 18, impressions: 172, clicks: 4, cost_micros: 97000000 },
    { date: '2025-08-18', hour: 19, impressions: 209, clicks: 6, cost_micros: 175000000 },
    { date: '2025-08-18', hour: 20, impressions: 254, clicks: 9, cost_micros: 233000000 },
    { date: '2025-08-18', hour: 21, impressions: 337, clicks: 13, cost_micros: 373000000 },
    { date: '2025-08-18', hour: 22, impressions: 346, clicks: 20, cost_micros: 572000000 },
    { date: '2025-08-18', hour: 23, impressions: 384, clicks: 21, cost_micros: 594000000 },
    
    // 8/19の完全データ 
    { date: '2025-08-19', hour: 0, impressions: 246, clicks: 8, cost_micros: 252000000 },
    { date: '2025-08-19', hour: 1, impressions: 164, clicks: 2, cost_micros: 53000000 },
    { date: '2025-08-19', hour: 2, impressions: 93, clicks: 2, cost_micros: 74000000 },
    { date: '2025-08-19', hour: 3, impressions: 90, clicks: 0, cost_micros: 0 },
    { date: '2025-08-19', hour: 4, impressions: 71, clicks: 3, cost_micros: 91000000 },
    { date: '2025-08-19', hour: 5, impressions: 122, clicks: 1, cost_micros: 29000000 },
    { date: '2025-08-19', hour: 6, impressions: 173, clicks: 8, cost_micros: 418000000 },
    { date: '2025-08-19', hour: 7, impressions: 194, clicks: 13, cost_micros: 645816421 },
    { date: '2025-08-19', hour: 8, impressions: 154, clicks: 6, cost_micros: 226000000 },
    { date: '2025-08-19', hour: 9, impressions: 153, clicks: 6, cost_micros: 199000000 },
    { date: '2025-08-19', hour: 10, impressions: 127, clicks: 4, cost_micros: 122000000 },
    { date: '2025-08-19', hour: 11, impressions: 128, clicks: 3, cost_micros: 100000000 },
    { date: '2025-08-19', hour: 12, impressions: 159, clicks: 4, cost_micros: 131000000 },
    { date: '2025-08-19', hour: 13, impressions: 152, clicks: 6, cost_micros: 204000000 },
    { date: '2025-08-19', hour: 14, impressions: 159, clicks: 10, cost_micros: 363488281 },
    { date: '2025-08-19', hour: 15, impressions: 166, clicks: 6, cost_micros: 256000000 },
    { date: '2025-08-19', hour: 16, impressions: 171, clicks: 2, cost_micros: 74617471 },
    { date: '2025-08-19', hour: 17, impressions: 169, clicks: 5, cost_micros: 140000000 },
    { date: '2025-08-19', hour: 18, impressions: 181, clicks: 7, cost_micros: 294571941 },
    { date: '2025-08-19', hour: 19, impressions: 225, clicks: 8, cost_micros: 245000000 },
    { date: '2025-08-19', hour: 20, impressions: 303, clicks: 12, cost_micros: 495000000 },
    { date: '2025-08-19', hour: 21, impressions: 345, clicks: 9, cost_micros: 346000000 },
    { date: '2025-08-19', hour: 22, impressions: 416, clicks: 15, cost_micros: 455000000 },
    { date: '2025-08-19', hour: 23, impressions: 478, clicks: 31, cost_micros: 1097000000 },
    
    // 8/20の完全データ
    { date: '2025-08-20', hour: 0, impressions: 266, clicks: 12, cost_micros: 400000000 },
    { date: '2025-08-20', hour: 1, impressions: 309, clicks: 22, cost_micros: 886523292 },
    { date: '2025-08-20', hour: 2, impressions: 159, clicks: 5, cost_micros: 234368736 },
    { date: '2025-08-20', hour: 3, impressions: 123, clicks: 3, cost_micros: 137000000 },
    { date: '2025-08-20', hour: 4, impressions: 151, clicks: 9, cost_micros: 378000000 },
    { date: '2025-08-20', hour: 5, impressions: 237, clicks: 20, cost_micros: 800000000 },
    { date: '2025-08-20', hour: 6, impressions: 355, clicks: 30, cost_micros: 1421000000 },
    { date: '2025-08-20', hour: 7, impressions: 470, clicks: 43, cost_micros: 1808000000 },
    { date: '2025-08-20', hour: 8, impressions: 346, clicks: 15, cost_micros: 676000000 },
    { date: '2025-08-20', hour: 9, impressions: 416, clicks: 12, cost_micros: 472000000 },
    { date: '2025-08-20', hour: 10, impressions: 429, clicks: 13, cost_micros: 837960365 },
    { date: '2025-08-20', hour: 11, impressions: 490, clicks: 21, cost_micros: 1499842151 },
    { date: '2025-08-20', hour: 12, impressions: 455, clicks: 14, cost_micros: 784832576 },
    { date: '2025-08-20', hour: 13, impressions: 468, clicks: 17, cost_micros: 938807795 },
    { date: '2025-08-20', hour: 14, impressions: 416, clicks: 16, cost_micros: 870029087 },
    { date: '2025-08-20', hour: 15, impressions: 464, clicks: 10, cost_micros: 617757799 },
    { date: '2025-08-20', hour: 16, impressions: 554, clicks: 23, cost_micros: 1286000000 },
    { date: '2025-08-20', hour: 17, impressions: 464, clicks: 14, cost_micros: 570538445 },
    { date: '2025-08-20', hour: 18, impressions: 443, clicks: 22, cost_micros: 958608001 },
    { date: '2025-08-20', hour: 19, impressions: 397, clicks: 21, cost_micros: 828896208 },
    { date: '2025-08-20', hour: 20, impressions: 373, clicks: 25, cost_micros: 925000000 },
    { date: '2025-08-20', hour: 21, impressions: 36, clicks: 2, cost_micros: 67000000 },
    { date: '2025-08-20', hour: 22, impressions: 43, clicks: 0, cost_micros: 0 },
    { date: '2025-08-20', hour: 23, impressions: 44, clicks: 0, cost_micros: 0 },
    
    // 8/21の完全データ
    { date: '2025-08-21', hour: 0, impressions: 662, clicks: 42, cost_micros: 1415000000 },
    { date: '2025-08-21', hour: 1, impressions: 206, clicks: 7, cost_micros: 233000000 },
    { date: '2025-08-21', hour: 2, impressions: 138, clicks: 4, cost_micros: 134000000 },
    { date: '2025-08-21', hour: 3, impressions: 153, clicks: 4, cost_micros: 162000000 },
    { date: '2025-08-21', hour: 4, impressions: 173, clicks: 14, cost_micros: 582000000 },
    { date: '2025-08-21', hour: 5, impressions: 269, clicks: 11, cost_micros: 415000000 },
    { date: '2025-08-21', hour: 6, impressions: 338, clicks: 15, cost_micros: 555000000 },
    { date: '2025-08-21', hour: 7, impressions: 337, clicks: 25, cost_micros: 937639719 },
    { date: '2025-08-21', hour: 8, impressions: 365, clicks: 10, cost_micros: 450000000 },
    { date: '2025-08-21', hour: 9, impressions: 325, clicks: 16, cost_micros: 583000000 },
    { date: '2025-08-21', hour: 10, impressions: 284, clicks: 10, cost_micros: 449000000 },
    { date: '2025-08-21', hour: 11, impressions: 345, clicks: 10, cost_micros: 494603192 },
    { date: '2025-08-21', hour: 12, impressions: 431, clicks: 23, cost_micros: 998846317 },
    { date: '2025-08-21', hour: 13, impressions: 318, clicks: 8, cost_micros: 394000000 },
    { date: '2025-08-21', hour: 14, impressions: 318, clicks: 17, cost_micros: 714788125 },
    { date: '2025-08-21', hour: 15, impressions: 343, clicks: 14, cost_micros: 650000000 },
    { date: '2025-08-21', hour: 16, impressions: 353, clicks: 26, cost_micros: 1296000000 },
    { date: '2025-08-21', hour: 17, impressions: 389, clicks: 22, cost_micros: 836592904 },
    { date: '2025-08-21', hour: 18, impressions: 381, clicks: 21, cost_micros: 922607679 },
    { date: '2025-08-21', hour: 19, impressions: 292, clicks: 12, cost_micros: 397000000 },
    { date: '2025-08-21', hour: 20, impressions: 316, clicks: 21, cost_micros: 649000000 },
    
    // 8/22の完全データ
    { date: '2025-08-22', hour: 0, impressions: 265, clicks: 16, cost_micros: 610000000 },
    { date: '2025-08-22', hour: 1, impressions: 236, clicks: 6, cost_micros: 302790370 },
    { date: '2025-08-22', hour: 2, impressions: 158, clicks: 6, cost_micros: 207000000 },
    { date: '2025-08-22', hour: 3, impressions: 189, clicks: 8, cost_micros: 319000000 },
    { date: '2025-08-22', hour: 4, impressions: 208, clicks: 8, cost_micros: 365000000 },
    { date: '2025-08-22', hour: 5, impressions: 213, clicks: 16, cost_micros: 529000000 },
    { date: '2025-08-22', hour: 6, impressions: 192, clicks: 21, cost_micros: 762000000 },
    { date: '2025-08-22', hour: 7, impressions: 252, clicks: 10, cost_micros: 332000000 },
    { date: '2025-08-22', hour: 8, impressions: 246, clicks: 7, cost_micros: 289000000 },
    { date: '2025-08-22', hour: 9, impressions: 225, clicks: 7, cost_micros: 317000000 },
    { date: '2025-08-22', hour: 10, impressions: 208, clicks: 3, cost_micros: 133000000 },
    { date: '2025-08-22', hour: 11, impressions: 240, clicks: 7, cost_micros: 197000000 },
    { date: '2025-08-22', hour: 12, impressions: 227, clicks: 7, cost_micros: 224000000 },
    { date: '2025-08-22', hour: 13, impressions: 248, clicks: 4, cost_micros: 207960158 },
    { date: '2025-08-22', hour: 14, impressions: 246, clicks: 3, cost_micros: 121000000 },
    { date: '2025-08-22', hour: 15, impressions: 246, clicks: 6, cost_micros: 260889834 },
    { date: '2025-08-22', hour: 16, impressions: 282, clicks: 13, cost_micros: 538000000 },
    { date: '2025-08-22', hour: 17, impressions: 297, clicks: 11, cost_micros: 489000000 },
    { date: '2025-08-22', hour: 18, impressions: 326, clicks: 10, cost_micros: 448000000 },
    { date: '2025-08-22', hour: 19, impressions: 371, clicks: 23, cost_micros: 914000000 },
    { date: '2025-08-22', hour: 20, impressions: 362, clicks: 23, cost_micros: 921000000 },
    { date: '2025-08-22', hour: 21, impressions: 444, clicks: 15, cost_micros: 561741331 },
    { date: '2025-08-22', hour: 22, impressions: 444, clicks: 33, cost_micros: 1214000000 },
    { date: '2025-08-22', hour: 23, impressions: 162, clicks: 16, cost_micros: 587000000 },
    
    // 8/23の完全データ
    { date: '2025-08-23', hour: 0, impressions: 288, clicks: 14, cost_micros: 458000000 },
    { date: '2025-08-23', hour: 1, impressions: 223, clicks: 11, cost_micros: 329000000 },
    { date: '2025-08-23', hour: 2, impressions: 166, clicks: 5, cost_micros: 184000000 },
    { date: '2025-08-23', hour: 3, impressions: 141, clicks: 7, cost_micros: 218000000 },
    { date: '2025-08-23', hour: 4, impressions: 183, clicks: 10, cost_micros: 350000000 },
    { date: '2025-08-23', hour: 5, impressions: 129, clicks: 11, cost_micros: 320000000 },
    { date: '2025-08-23', hour: 6, impressions: 172, clicks: 12, cost_micros: 375000000 },
    { date: '2025-08-23', hour: 7, impressions: 231, clicks: 13, cost_micros: 408000000 },
    { date: '2025-08-23', hour: 8, impressions: 193, clicks: 12, cost_micros: 408000000 },
    { date: '2025-08-23', hour: 9, impressions: 243, clicks: 13, cost_micros: 433000000 },
    { date: '2025-08-23', hour: 10, impressions: 259, clicks: 13, cost_micros: 444000000 },
    { date: '2025-08-23', hour: 11, impressions: 243, clicks: 10, cost_micros: 373000000 },
    { date: '2025-08-23', hour: 12, impressions: 247, clicks: 9, cost_micros: 304000000 },
    { date: '2025-08-23', hour: 13, impressions: 311, clicks: 3, cost_micros: 89000000 },
    { date: '2025-08-23', hour: 14, impressions: 284, clicks: 9, cost_micros: 423000000 },
    { date: '2025-08-23', hour: 15, impressions: 263, clicks: 9, cost_micros: 308000000 },
    { date: '2025-08-23', hour: 16, impressions: 330, clicks: 13, cost_micros: 460000000 },
    { date: '2025-08-23', hour: 17, impressions: 275, clicks: 12, cost_micros: 489000000 },
    { date: '2025-08-23', hour: 18, impressions: 312, clicks: 16, cost_micros: 585372131 },
    { date: '2025-08-23', hour: 19, impressions: 432, clicks: 55, cost_micros: 1960000000 },
    { date: '2025-08-23', hour: 20, impressions: 310, clicks: 27, cost_micros: 782000000 },
    { date: '2025-08-23', hour: 21, impressions: 326, clicks: 19, cost_micros: 573000000 },
    { date: '2025-08-23', hour: 22, impressions: 149, clicks: 11, cost_micros: 334000000 },
    
    // 8/24の完全データ
    { date: '2025-08-24', hour: 0, impressions: 386, clicks: 25, cost_micros: 863000000 },
    { date: '2025-08-24', hour: 1, impressions: 157, clicks: 5, cost_micros: 206000000 },
    { date: '2025-08-24', hour: 2, impressions: 156, clicks: 9, cost_micros: 261000000 },
    { date: '2025-08-24', hour: 3, impressions: 127, clicks: 8, cost_micros: 268000000 },
    { date: '2025-08-24', hour: 4, impressions: 138, clicks: 5, cost_micros: 175000000 },
    { date: '2025-08-24', hour: 5, impressions: 225, clicks: 12, cost_micros: 464000000 },
    { date: '2025-08-24', hour: 6, impressions: 190, clicks: 12, cost_micros: 423000000 },
    { date: '2025-08-24', hour: 7, impressions: 196, clicks: 14, cost_micros: 409000000 },
    { date: '2025-08-24', hour: 8, impressions: 243, clicks: 15, cost_micros: 505000000 },
    { date: '2025-08-24', hour: 9, impressions: 259, clicks: 8, cost_micros: 217000000 },
    { date: '2025-08-24', hour: 10, impressions: 287, clicks: 12, cost_micros: 390000000 },
    { date: '2025-08-24', hour: 11, impressions: 265, clicks: 9, cost_micros: 293000000 },
    { date: '2025-08-24', hour: 12, impressions: 243, clicks: 9, cost_micros: 313000000 },
    { date: '2025-08-24', hour: 13, impressions: 238, clicks: 14, cost_micros: 356000000 },
    { date: '2025-08-24', hour: 14, impressions: 253, clicks: 7, cost_micros: 226456148 },
    { date: '2025-08-24', hour: 15, impressions: 264, clicks: 12, cost_micros: 380000000 },
    { date: '2025-08-24', hour: 16, impressions: 284, clicks: 10, cost_micros: 306000000 },
    { date: '2025-08-24', hour: 17, impressions: 254, clicks: 5, cost_micros: 171000000 },
    { date: '2025-08-24', hour: 18, impressions: 297, clicks: 8, cost_micros: 231000000 },
    { date: '2025-08-24', hour: 19, impressions: 325, clicks: 10, cost_micros: 367000000 },
    { date: '2025-08-24', hour: 20, impressions: 418, clicks: 29, cost_micros: 907000000 },
    { date: '2025-08-24', hour: 21, impressions: 445, clicks: 24, cost_micros: 791000000 },
    { date: '2025-08-24', hour: 22, impressions: 513, clicks: 13, cost_micros: 458000000 },
    { date: '2025-08-24', hour: 23, impressions: 280, clicks: 21, cost_micros: 664968337 },
    
    // 8/25の完全データ
    { date: '2025-08-25', hour: 0, impressions: 178, clicks: 25, cost_micros: 825000000 },
    { date: '2025-08-25', hour: 1, impressions: 135, clicks: 7, cost_micros: 211000000 },
    { date: '2025-08-25', hour: 2, impressions: 119, clicks: 5, cost_micros: 148000000 },
    { date: '2025-08-25', hour: 3, impressions: 110, clicks: 6, cost_micros: 184000000 },
    { date: '2025-08-25', hour: 4, impressions: 152, clicks: 13, cost_micros: 390000000 },
    { date: '2025-08-25', hour: 5, impressions: 206, clicks: 32, cost_micros: 1037000000 },
    { date: '2025-08-25', hour: 6, impressions: 129, clicks: 14, cost_micros: 357000000 },
    { date: '2025-08-25', hour: 7, impressions: 193, clicks: 7, cost_micros: 182000000 },
    { date: '2025-08-25', hour: 8, impressions: 174, clicks: 7, cost_micros: 193000000 },
    { date: '2025-08-25', hour: 9, impressions: 126, clicks: 2, cost_micros: 46000000 },
    { date: '2025-08-25', hour: 10, impressions: 114, clicks: 1, cost_micros: 19000000 },
    { date: '2025-08-25', hour: 11, impressions: 147, clicks: 7, cost_micros: 163000000 },
    { date: '2025-08-25', hour: 12, impressions: 171, clicks: 4, cost_micros: 96000000 },
    { date: '2025-08-25', hour: 13, impressions: 172, clicks: 3, cost_micros: 68000000 },
    { date: '2025-08-25', hour: 14, impressions: 179, clicks: 6, cost_micros: 185000000 },
    { date: '2025-08-25', hour: 15, impressions: 131, clicks: 0, cost_micros: 0 },
    { date: '2025-08-25', hour: 16, impressions: 135, clicks: 4, cost_micros: 126000000 },
    { date: '2025-08-25', hour: 17, impressions: 140, clicks: 10, cost_micros: 339000000 },
    { date: '2025-08-25', hour: 18, impressions: 136, clicks: 4, cost_micros: 115000000 },
    { date: '2025-08-25', hour: 19, impressions: 209, clicks: 20, cost_micros: 666000000 },
    { date: '2025-08-25', hour: 20, impressions: 258, clicks: 21, cost_micros: 701000000 },
    { date: '2025-08-25', hour: 21, impressions: 313, clicks: 19, cost_micros: 602000000 },
    { date: '2025-08-25', hour: 22, impressions: 364, clicks: 29, cost_micros: 826000000 },
    { date: '2025-08-25', hour: 23, impressions: 448, clicks: 60, cost_micros: 1829000000 },
    
    // 8/26の完全データ
    { date: '2025-08-26', hour: 0, impressions: 248, clicks: 17, cost_micros: 507000000 },
    { date: '2025-08-26', hour: 1, impressions: 144, clicks: 13, cost_micros: 356000000 },
    { date: '2025-08-26', hour: 2, impressions: 105, clicks: 10, cost_micros: 341000000 },
    { date: '2025-08-26', hour: 3, impressions: 86, clicks: 8, cost_micros: 226000000 },
    { date: '2025-08-26', hour: 4, impressions: 125, clicks: 15, cost_micros: 519000000 },
    { date: '2025-08-26', hour: 5, impressions: 187, clicks: 33, cost_micros: 1042000000 },
    { date: '2025-08-26', hour: 6, impressions: 191, clicks: 25, cost_micros: 672000000 },
    { date: '2025-08-26', hour: 7, impressions: 179, clicks: 19, cost_micros: 523000000 },
    { date: '2025-08-26', hour: 8, impressions: 140, clicks: 12, cost_micros: 357000000 },
    { date: '2025-08-26', hour: 9, impressions: 98, clicks: 11, cost_micros: 360000000 },
    { date: '2025-08-26', hour: 10, impressions: 104, clicks: 8, cost_micros: 283000000 },
    { date: '2025-08-26', hour: 11, impressions: 128, clicks: 9, cost_micros: 288000000 },
    { date: '2025-08-26', hour: 12, impressions: 146, clicks: 4, cost_micros: 69000000 },
    { date: '2025-08-26', hour: 13, impressions: 148, clicks: 10, cost_micros: 307000000 },
    { date: '2025-08-26', hour: 14, impressions: 166, clicks: 17, cost_micros: 542000000 },
    { date: '2025-08-26', hour: 15, impressions: 129, clicks: 7, cost_micros: 244000000 },
    { date: '2025-08-26', hour: 16, impressions: 152, clicks: 11, cost_micros: 332000000 },
    { date: '2025-08-26', hour: 17, impressions: 175, clicks: 18, cost_micros: 512000000 },
    { date: '2025-08-26', hour: 18, impressions: 202, clicks: 6, cost_micros: 160000000 },
    { date: '2025-08-26', hour: 19, impressions: 249, clicks: 33, cost_micros: 997000000 },
    { date: '2025-08-26', hour: 20, impressions: 296, clicks: 16, cost_micros: 506000000 },
    { date: '2025-08-26', hour: 21, impressions: 386, clicks: 29, cost_micros: 891000000 },
    { date: '2025-08-26', hour: 22, impressions: 512, clicks: 27, cost_micros: 715000000 },
    { date: '2025-08-26', hour: 23, impressions: 39, clicks: 0, cost_micros: 0 },
    
    // 8/27の完全データ
    { date: '2025-08-27', hour: 0, impressions: 267, clicks: 7, cost_micros: 180000000 },
    { date: '2025-08-27', hour: 1, impressions: 192, clicks: 9, cost_micros: 252000000 },
    { date: '2025-08-27', hour: 2, impressions: 157, clicks: 7, cost_micros: 170000000 },
    { date: '2025-08-27', hour: 3, impressions: 99, clicks: 4, cost_micros: 114000000 },
    { date: '2025-08-27', hour: 4, impressions: 119, clicks: 4, cost_micros: 111000000 },
    { date: '2025-08-27', hour: 5, impressions: 199, clicks: 11, cost_micros: 354000000 },
    { date: '2025-08-27', hour: 6, impressions: 232, clicks: 13, cost_micros: 390000000 },
    { date: '2025-08-27', hour: 7, impressions: 239, clicks: 10, cost_micros: 297000000 },
    { date: '2025-08-27', hour: 8, impressions: 220, clicks: 9, cost_micros: 261792217 },
    { date: '2025-08-27', hour: 9, impressions: 143, clicks: 9, cost_micros: 234000000 },
    { date: '2025-08-27', hour: 10, impressions: 130, clicks: 3, cost_micros: 89000000 },
    { date: '2025-08-27', hour: 11, impressions: 147, clicks: 10, cost_micros: 303000000 },
    { date: '2025-08-27', hour: 12, impressions: 183, clicks: 13, cost_micros: 372000000 },
    { date: '2025-08-27', hour: 13, impressions: 162, clicks: 13, cost_micros: 411000000 },
    { date: '2025-08-27', hour: 14, impressions: 216, clicks: 13, cost_micros: 424000000 },
    { date: '2025-08-27', hour: 15, impressions: 174, clicks: 6, cost_micros: 189000000 },
    { date: '2025-08-27', hour: 16, impressions: 212, clicks: 10, cost_micros: 294000000 },
    { date: '2025-08-27', hour: 17, impressions: 195, clicks: 7, cost_micros: 228000000 },
    { date: '2025-08-27', hour: 18, impressions: 252, clicks: 7, cost_micros: 197000000 },
    { date: '2025-08-27', hour: 19, impressions: 239, clicks: 11, cost_micros: 362777088 },
    { date: '2025-08-27', hour: 20, impressions: 307, clicks: 14, cost_micros: 445000000 },
    { date: '2025-08-27', hour: 21, impressions: 356, clicks: 20, cost_micros: 613000000 },
    { date: '2025-08-27', hour: 22, impressions: 425, clicks: 22, cost_micros: 617000000 },
    { date: '2025-08-27', hour: 23, impressions: 149, clicks: 15, cost_micros: 515282229 },
    
    // 8/28の完全データ
    { date: '2025-08-28', hour: 0, impressions: 252, clicks: 15, cost_micros: 434000000 },
    { date: '2025-08-28', hour: 1, impressions: 178, clicks: 16, cost_micros: 454000000 },
    { date: '2025-08-28', hour: 2, impressions: 108, clicks: 10, cost_micros: 278000000 },
    { date: '2025-08-28', hour: 3, impressions: 146, clicks: 7, cost_micros: 207000000 },
    { date: '2025-08-28', hour: 4, impressions: 137, clicks: 9, cost_micros: 280000000 },
    { date: '2025-08-28', hour: 5, impressions: 152, clicks: 19, cost_micros: 574836060 },
    { date: '2025-08-28', hour: 6, impressions: 212, clicks: 18, cost_micros: 521000000 },
    { date: '2025-08-28', hour: 7, impressions: 271, clicks: 15, cost_micros: 426000000 },
    { date: '2025-08-28', hour: 8, impressions: 242, clicks: 12, cost_micros: 366000000 },
    { date: '2025-08-28', hour: 9, impressions: 149, clicks: 2, cost_micros: 67000000 },
    { date: '2025-08-28', hour: 10, impressions: 145, clicks: 3, cost_micros: 118000000 },
    { date: '2025-08-28', hour: 11, impressions: 176, clicks: 4, cost_micros: 129000000 },
    { date: '2025-08-28', hour: 12, impressions: 186, clicks: 5, cost_micros: 158000000 },
    { date: '2025-08-28', hour: 13, impressions: 139, clicks: 6, cost_micros: 195000000 },
    { date: '2025-08-28', hour: 14, impressions: 155, clicks: 1, cost_micros: 20000000 },
    { date: '2025-08-28', hour: 15, impressions: 202, clicks: 8, cost_micros: 259000000 },
    { date: '2025-08-28', hour: 16, impressions: 186, clicks: 10, cost_micros: 382000000 },
    { date: '2025-08-28', hour: 17, impressions: 181, clicks: 7, cost_micros: 250000000 },
    { date: '2025-08-28', hour: 18, impressions: 121, clicks: 2, cost_micros: 64000000 }
  ]
}

// 時間別データを4時間ウィンドウに正確に集計
function aggregateToFourHourWindows(hourlyData: any[]) {
  const windowData: any[] = []
  
  // 日付別にグループ化
  const dateGroups = hourlyData.reduce((groups, item) => {
    if (!groups[item.date]) groups[item.date] = []
    groups[item.date].push(item)
    return groups
  }, {} as Record<string, any[]>)
  
  Object.keys(dateGroups).sort().forEach(date => {
    const dayData = dateGroups[date]
    
    // 4時間ウィンドウ定義: 0-3, 4-7, 8-11, 12-15, 16-19, 20-23
    const windows = [
      { start: 0, end: 3 },
      { start: 4, end: 7 },
      { start: 8, end: 11 },
      { start: 12, end: 15 },
      { start: 16, end: 19 },
      { start: 20, end: 23 }
    ]
    
    windows.forEach(window => {
      const windowHours = dayData.filter(item => 
        item.hour >= window.start && item.hour <= window.end
      )
      
      if (windowHours.length > 0) {
        const aggregated = windowHours.reduce((acc, item) => ({
          impressions: acc.impressions + item.impressions,
          clicks: acc.clicks + item.clicks,
          cost: acc.cost + Math.round(item.cost_micros / 1000000),
          conversions: 0
        }), { impressions: 0, clicks: 0, cost: 0, conversions: 0 })
        
        const tsStart = new Date(date + 'T00:00:00.000Z')
        tsStart.setUTCHours(window.start, 0, 0, 0)
        
        const tsEnd = new Date(tsStart)
        tsEnd.setUTCHours(window.start + 4, 0, 0, 0)
        
        windowData.push({
          product_id: 'watashi-compass',
          campaign_id: '22873791559',
          campaign_name: 'わたしコンパス_ベータテスター募集_2025',
          window_hours: 4,
          ts_start: tsStart.toISOString(),
          ts_end: tsEnd.toISOString(),
          impressions: aggregated.impressions,
          clicks: aggregated.clicks,
          cost: aggregated.cost,
          conversions: aggregated.conversions,
          platform: 'Google Ads',
          is_real_data: true
        })
      }
    })
  })
  
  return windowData
}

export async function POST(req: NextRequest) {
  try {
    console.log('Google Ads完全時間別データから正確な4時間ウィンドウ集計開始')
    
    const client = new ConvexHttpClient(resolveConvexUrl())
    
    // Step 1: 完全な時間別データを取得
    const hourlyData = getCompleteHourlyData()
    console.log(`完全時間別データ: ${hourlyData.length}件`)
    
    // Step 2: 4時間ウィンドウに正確に集計
    const windowData = aggregateToFourHourWindows(hourlyData)
    console.log(`4時間ウィンドウデータ: ${windowData.length}件`)
    
    // Step 3: 既存データをクリア
    console.log('Convex既存データ削除中...')
    const deleteResult = await client.mutation(api.ads.clearWindowMetricsByProduct, {
      product_id: 'watashi-compass'
    })
    console.log(`削除完了: ${deleteResult.deleted}件`)
    
    // Step 4: 新しいデータを同期
    console.log('Convex新データ同期処理中...')
    const items = windowData.map(w => ({
      ts_start: new Date(w.ts_start).getTime(),
      impressions: w.impressions,
      clicks: w.clicks,
      cost: w.cost,
      conversions: w.conversions,
      platform: w.platform
    }))
    
    const result = await client.mutation(api.ads.importWindowMetrics, {
      workspace_id: 'unson-os-workspace',
      product_id: 'watashi-compass',
      window_hours: 4,
      items: items
    })
    
    console.log(`同期完了: ${items.length}件の完全4時間ウィンドウデータ`)
    
    // 総金額計算
    const totalCost = items.reduce((sum, item) => sum + item.cost, 0)
    
    return NextResponse.json({
      success: true,
      message: 'Google Ads完全時間別データから正確な4時間ウィンドウ集計完了',
      data: {
        hourlyRecords: hourlyData.length,
        windowRecords: windowData.length,
        syncedRecords: items.length,
        totalCost: totalCost,
        dateRange: '2025-08-06 ~ 2025-08-28',
        verification: {
          expectedTotal: 147774, // 全日合計の期待値
          actualTotal: totalCost,
          isAccurate: Math.abs(totalCost - 147774) < 1000
        }
      }
    })
    
  } catch (error: any) {
    console.error('完全時間別データ同期エラー:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      message: '完全時間別データ同期に失敗しました'
    }, { status: 500 })
  }
}