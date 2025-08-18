const fs = require('fs');
const path = require('path');

// SVGでプレースホルダー画像を生成
function createPlaceholderSVG(width, height, text, bgColor = '#667eea') {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#grad)" />
    <text x="50%" y="50%" font-family="Arial" font-size="${Math.min(width, height) / 10}" fill="white" opacity="0.7" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
}

// 画像データ定義
const images = [
  { name: 'hero-bg.svg', width: 1920, height: 1080, text: 'HERO BACKGROUND', color: '#667eea' },
  { name: 'problem-1.svg', width: 600, height: 400, text: 'PROBLEM 1', color: '#fde68a' },
  { name: 'problem-2.svg', width: 600, height: 400, text: 'PROBLEM 2', color: '#fca5a5' },
  { name: 'problem-3.svg', width: 600, height: 400, text: 'PROBLEM 3', color: '#bfdbfe' },
  { name: 'feature-1.svg', width: 800, height: 600, text: 'FEATURE 1', color: '#667eea' },
  { name: 'feature-2.svg', width: 800, height: 600, text: 'FEATURE 2', color: '#f093fb' },
  { name: 'feature-3.svg', width: 800, height: 600, text: 'FEATURE 3', color: '#4facfe' },
  { name: 'service-1.svg', width: 600, height: 400, text: 'SERVICE 1', color: '#8b5cf6' },
  { name: 'service-2.svg', width: 600, height: 400, text: 'SERVICE 2', color: '#3b82f6' },
  { name: 'avatar-1.svg', width: 100, height: 100, text: 'USER 1', color: '#8b5cf6' },
  { name: 'avatar-2.svg', width: 100, height: 100, text: 'USER 2', color: '#3b82f6' },
  { name: 'avatar-3.svg', width: 100, height: 100, text: 'USER 3', color: '#10b981' },
];

// 出力ディレクトリ
const outputDir = path.join(__dirname, '../public/images');

// ディレクトリ作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// SVG画像を生成
images.forEach(img => {
  const svg = createPlaceholderSVG(img.width, img.height, img.text, img.color);
  const filePath = path.join(outputDir, img.name);
  fs.writeFileSync(filePath, svg);
  console.log(`Created: ${img.name}`);
});

console.log('\n✅ All placeholder images have been created!');
console.log(`📁 Location: ${outputDir}`);