# ai-stylist 画像生成ガイド

このガイドは、Claude DesktopのGemini MCPを使用してai-stylistサービス用の画像を生成するためのものです。

## 生成手順

Claude Desktopを再起動後、以下のプロンプトを順番に実行してください：

### 1. hero画像: hero-sustainable-fashion.jpg

**優先度**: high
**出力ファイル名**: hero-sustainable-fashion.jpg
**保存先**: `services/ai-stylist/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Create a professional hero background image (1200x600px) that represents あなたの価値観が輝く、持続可能なスタイルを見つけよう. The image should convey trust, innovation, and business professionalism. Use a corporate color palette with blues (#2563EB) and purples (#7C3AED). Include subtle elements suggesting intergenerational collaboration and AI technology. Style: clean, modern, business-focused, high-quality corporate imagery.

Context: AI技術で実現する、おしゃれと環境意識を両立した新しいファッションライフ。衝動買いを減らし、長く愛せるワードローブを一緒に作りませんか？
Service: ai-stylist (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-stylist/public/images/generated/hero-sustainable-fashion.jpg として保存してください。
```

---

### 2. problem画像: problem-impulse-buy

**優先度**: medium
**出力ファイル名**: problem-impulse-buy.jpg
**保存先**: `services/ai-stylist/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Generate a clean, minimalist illustration (400x400px) representing the business challenge: "衝動買いして後悔してしまう". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.

Context: セールやトレンドに流されて買い物をしてしまい、結局あまり着ない服が増えてしまう
Service: ai-stylist (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-stylist/public/images/generated/problem-impulse-buy.jpg として保存してください。
```

---

### 3. problem画像: problem-values-style

**優先度**: medium
**出力ファイル名**: problem-values-style.jpg
**保存先**: `services/ai-stylist/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Generate a clean, minimalist illustration (400x400px) representing the business challenge: "おしゃれと価値観が両立できない". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.

Context: 環境に配慮したいけれど、エシカルファッションはデザインが限られていて物足りない
Service: ai-stylist (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-stylist/public/images/generated/problem-values-style.jpg として保存してください。
```

---

### 4. problem画像: problem-wardrobe-waste

**優先度**: medium
**出力ファイル名**: problem-wardrobe-waste.jpg
**保存先**: `services/ai-stylist/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Generate a clean, minimalist illustration (400x400px) representing the business challenge: "手持ち服を活かしきれない". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.

Context: クローゼットに服はあるのに「着る服がない」と感じて、新しい服を買ってしまう
Service: ai-stylist (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-stylist/public/images/generated/problem-wardrobe-waste.jpg として保存してください。
```

---

### 5. problem画像: problem-no-strategy

**優先度**: medium
**出力ファイル名**: problem-no-strategy.jpg
**保存先**: `services/ai-stylist/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Generate a clean, minimalist illustration (400x400px) representing the business challenge: "長期的なスタイル戦略がない". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.

Context: その場しのぎの買い物ばかりで、一貫したスタイルや投資効率の良いワードローブが作れない
Service: ai-stylist (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-stylist/public/images/generated/problem-no-strategy.jpg として保存してください。
```

---

### 6. problem画像: problem-brand-info

**優先度**: medium
**出力ファイル名**: problem-brand-info.jpg
**保存先**: `services/ai-stylist/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Generate a clean, minimalist illustration (400x400px) representing the business challenge: "エシカルブランドの情報不足". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.

Context: 環境や社会に配慮したブランドを知りたいけれど、どこで信頼できる情報を得ればよいかわからない
Service: ai-stylist (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-stylist/public/images/generated/problem-brand-info.jpg として保存してください。
```

---

### 7. problem画像: problem-personal-style

**優先度**: medium
**出力ファイル名**: problem-personal-style.jpg
**保存先**: `services/ai-stylist/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Generate a clean, minimalist illustration (400x400px) representing the business challenge: "自分に似合うスタイルがわからない". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.

Context: トレンドは追えるけれど、本当に自分らしく、価値観と一致するスタイルが見つからない
Service: ai-stylist (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-stylist/public/images/generated/problem-personal-style.jpg として保存してください。
```

---

### 8. solution画像: solution-1.jpg

**優先度**: medium
**出力ファイル名**: solution-1.jpg
**保存先**: `services/ai-stylist/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Create a positive, forward-looking image (500x400px) that represents the innovative solution: "価値観×スタイルの完璧な融合". Show the benefits and transformation this solution brings. Use bright, optimistic colors while maintaining professionalism. Include subtle AI/technology elements. Style: modern, solution-oriented, inspiring, high-tech business imagery.

Context: AIが環境・社会・経済への価値観を詳細分析し、あなたの信念と美意識を両立するスタイルを提案します
Service: ai-stylist (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-stylist/public/images/generated/solution-1.jpg として保存してください。
```

---

### 9. solution画像: solution-2.jpg

**優先度**: medium
**出力ファイル名**: solution-2.jpg
**保存先**: `services/ai-stylist/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Create a positive, forward-looking image (500x400px) that represents the innovative solution: "科学的ワードローブ最適化". Show the benefits and transformation this solution brings. Use bright, optimistic colors while maintaining professionalism. Include subtle AI/technology elements. Style: modern, solution-oriented, inspiring, high-tech business imagery.

Context: 手持ち服を画像認識で分析し、投資効率と着回し可能性を計算。無駄のない戦略的なワードローブを構築します
Service: ai-stylist (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-stylist/public/images/generated/solution-2.jpg として保存してください。
```

---

### 10. solution画像: solution-3.jpg

**優先度**: medium
**出力ファイル名**: solution-3.jpg
**保存先**: `services/ai-stylist/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Create a positive, forward-looking image (500x400px) that represents the innovative solution: "透明性の高いブランド情報". Show the benefits and transformation this solution brings. Use bright, optimistic colors while maintaining professionalism. Include subtle AI/technology elements. Style: modern, solution-oriented, inspiring, high-tech business imagery.

Context: 製造過程から労働環境まで、ブランドの真の価値を可視化。安心して選択できるエシカルファッションをご紹介します
Service: ai-stylist (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-stylist/public/images/generated/solution-3.jpg として保存してください。
```

---

## 生成後の作業

1. **画像最適化**: 生成された画像のファイルサイズを確認し、必要に応じて最適化
2. **設定更新**: config.jsonの画像パスを新しい生成画像に更新
3. **バックアップ**: 既存のプレースホルダー画像をbackupディレクトリに移動
4. **テスト**: ローカル環境で画像表示を確認

## 生成完了チェックリスト

- [ ] hero: hero-sustainable-fashion.jpg
- [ ] problem: problem-impulse-buy
- [ ] problem: problem-values-style
- [ ] problem: problem-wardrobe-waste
- [ ] problem: problem-no-strategy
- [ ] problem: problem-brand-info
- [ ] problem: problem-personal-style
- [ ] solution: solution-1.jpg
- [ ] solution: solution-2.jpg
- [ ] solution: solution-3.jpg

## トラブルシューティング

- **MCPが表示されない**: Claude Desktopを再起動
- **画像生成エラー**: Gemini APIキーが正しく設定されているか確認
- **画像サイズ**: 生成された画像のサイズが要件に合わない場合は、プロンプトでサイズを再指定

## 完了後

全ての画像が生成されたら、以下のコマンドで統合を完了：

```bash
node scripts/integrate-generated-images.js ai-stylist
```
