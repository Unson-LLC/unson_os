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

// 追加の問題画像を生成
const additionalImages = [
  { name: 'problem-4.svg', width: 600, height: 400, text: 'PROBLEM 4', color: '#c7d2fe' },
  { name: 'problem-5.svg', width: 600, height: 400, text: 'PROBLEM 5', color: '#fed7aa' },
  { name: 'problem-6.svg', width: 600, height: 400, text: 'PROBLEM 6', color: '#fbbf24' },
];

// 出力ディレクトリ
const outputDir = path.join(__dirname, '../public/images');

// SVG画像を生成
additionalImages.forEach(img => {
  const svg = createPlaceholderSVG(img.width, img.height, img.text, img.color);
  const filePath = path.join(outputDir, img.name);
  fs.writeFileSync(filePath, svg);
  console.log(`Created: ${img.name}`);
});

console.log('\n✅ Additional placeholder images have been created!');
console.log(`📁 Location: ${outputDir}`);