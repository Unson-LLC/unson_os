#!/usr/bin/env node
// Convert Google Ads CSV export to history.json schema used by LP validation UI
// Usage:
//   node scripts/google-ads/convert-csv-to-history-json.js <input.csv> \
//     --product 2025-08-006-watashi-compass \
//     --out products/2-validation/2025-08-006-watashi-compass/ads/history.json

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Error: input CSV path required');
    process.exit(1);
  }
  const res = { input: args[0], product: '2025-08-006-watashi-compass', out: '' };
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--product') res.product = args[++i];
    else if (args[i] === '--out') res.out = args[++i];
  }
  if (!res.out) {
    res.out = path.join('products', '2-validation', res.product, 'ads', 'history.json');
  }
  return res;
}

function detectDelimiter(line) {
  if (line.includes('\t')) return '\t';
  return ',';
}

function normalizeCost(val) {
  if (val == null) return 0;
  if (typeof val === 'number') return Math.round(val);
  const s = String(val).replace(/[^0-9.]/g, '');
  if (!s) return 0;
  const n = Number(s);
  // Heuristic: if value looks like micros (very large), scale down
  if (n > 1e6) return Math.round(n / 1_000_000);
  return Math.round(n);
}

function toInt(val) {
  if (val == null) return 0;
  const s = String(val).replace(/[^0-9.-]/g, '');
  if (s === '') return 0;
  return Math.round(Number(s));
}

function loadCsv(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/).filter(l => l.trim() !== '');
  if (lines.length < 2) return [];
  const delim = detectDelimiter(lines[0]);
  const header = lines[0].split(delim).map(h => h.trim());
  const lower = header.map(h => h.toLowerCase());
  // column map (EN/JP variations)
  const idx = {
    date: lower.findIndex(h => h === 'date' || h.includes('日付')),
    impressions: lower.findIndex(h => h === 'impressions' || h.includes('表示回数')),
    clicks: lower.findIndex(h => h === 'clicks' || h.includes('クリック')),
    cost: lower.findIndex(h => h === 'cost' || h.includes('費用')),
    conversions: lower.findIndex(h => h.startsWith('conversions') || h.includes('コンバージョン')),
  };
  const miss = Object.entries(idx).filter(([, i]) => i < 0).map(([k]) => k);
  if (miss.length) {
    console.error('Missing columns in CSV:', miss.join(', '));
    process.exit(1);
  }
  const items = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(delim).map(c => c.trim());
    if (cols.length < header.length) continue;
    const date = cols[idx.date].replace(/\//g, '-');
    const impressions = toInt(cols[idx.impressions]);
    const clicks = toInt(cols[idx.clicks]);
    const cost = normalizeCost(cols[idx.cost]);
    const conversions = toInt(cols[idx.conversions]);
    items.push({ date, impressions, clicks, cost, conversions });
  }
  return items;
}

function ensureDir(p) {
  const dir = path.dirname(p);
  fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const { input, out } = parseArgs();
  const items = loadCsv(input);
  ensureDir(out);
  fs.writeFileSync(out, JSON.stringify(items, null, 2));
  console.log(`Wrote ${items.length} records to ${out}`);
}

if (require.main === module) {
  main();
}

