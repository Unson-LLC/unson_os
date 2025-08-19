# ai-bridge 画像生成ガイド

このガイドは、Claude DesktopのGemini MCPを使用してai-bridgeサービス用の画像を生成するためのものです。

## 生成手順

Claude Desktopを再起動後、以下のプロンプトを順番に実行してください：

### 1. hero画像: hero-bridge

**優先度**: high
**出力ファイル名**: hero-bridge.jpg
**保存先**: `services/ai-bridge/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Create a professional hero background image (1200x600px) that represents 世代の違いを強みに変える、新時代のリーダーになろう. The image should convey trust, innovation, and business professionalism. Use a corporate color palette with blues (#2563EB) and purples (#7C3AED). Include subtle elements suggesting intergenerational collaboration and AI technology. Style: clean, modern, business-focused, high-quality corporate imagery.

Context: Z世代部下との関係に悩む管理職の方へ。AI技術で世代間ギャップを解決し、全世代が活躍できる革新的なチーム作りを実現します。
Service: ai-bridge (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-bridge/public/images/generated/hero-bridge.jpg として保存してください。
```

---

### 2. problem画像: problem-understanding

**優先度**: medium
**出力ファイル名**: problem-understanding.jpg
**保存先**: `services/ai-bridge/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Generate a clean, minimalist illustration (400x400px) representing the business challenge: "Z世代部下の考えが理解できない". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.

Context: 「なぜすぐに転職を考えるのか」「リモートワークにこだわる理由は」など、若手の価値観が理解しにくい
Service: ai-bridge (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-bridge/public/images/generated/problem-understanding.jpg として保存してください。
```

---

### 3. problem画像: problem-guidance

**優先度**: medium
**出力ファイル名**: problem-guidance.jpg
**保存先**: `services/ai-bridge/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Generate a clean, minimalist illustration (400x400px) representing the business challenge: "指導方法が響かない". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.

Context: 従来の指導方法では成果が出ず、部下のモチベーションが上がらない。何をどう伝えればいいのか分からない
Service: ai-bridge (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-bridge/public/images/generated/problem-guidance.jpg として保存してください。
```

---

### 4. problem画像: problem-conflict

**優先度**: medium
**出力ファイル名**: problem-conflict.jpg
**保存先**: `services/ai-bridge/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Generate a clean, minimalist illustration (400x400px) representing the business challenge: "チーム内の世代間対立". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.

Context: ベテランと若手の間で価値観の衝突が起き、チームの雰囲気が悪化。生産性の低下が深刻
Service: ai-bridge (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-bridge/public/images/generated/problem-conflict.jpg として保存してください。
```

---

### 5. problem画像: problem-evaluation

**優先度**: medium
**出力ファイル名**: problem-evaluation.jpg
**保存先**: `services/ai-bridge/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Generate a clean, minimalist illustration (400x400px) representing the business challenge: "評価面談で何を話せばいいか困る". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.

Context: 世代が違うと何をフィードバックすべきか悩む。相手に響く評価方法が分からない
Service: ai-bridge (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-bridge/public/images/generated/problem-evaluation.jpg として保存してください。
```

---

### 6. problem画像: problem-meeting

**優先度**: medium
**出力ファイル名**: problem-meeting.jpg
**保存先**: `services/ai-bridge/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Generate a clean, minimalist illustration (400x400px) representing the business challenge: "会議で発言に偏りが出る". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.

Context: ベテランばかりが話し、若手が発言しない。または逆のパターンで、バランスの取れた議論ができない
Service: ai-bridge (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-bridge/public/images/generated/problem-meeting.jpg として保存してください。
```

---

### 7. problem画像: problem-change

**優先度**: medium
**出力ファイル名**: problem-change.jpg
**保存先**: `services/ai-bridge/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Generate a clean, minimalist illustration (400x400px) representing the business challenge: "組織変革への抵抗がある". The image should be simple, easily understandable, and convey the frustration or difficulty of this workplace issue. Use a professional color scheme with subtle blues and grays. Style: simplified business illustration, icon-like, clear visual metaphor.

Context: 新しい取り組みを始めようとすると、世代によって反応が大きく異なり、全体の合意形成が困難
Service: ai-bridge (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-bridge/public/images/generated/problem-change.jpg として保存してください。
```

---

### 8. solution画像: solution-1.jpg

**優先度**: medium
**出力ファイル名**: solution-1.jpg
**保存先**: `services/ai-bridge/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Create a positive, forward-looking image (500x400px) that represents the innovative solution: "世代特性を科学的に分析". Show the benefits and transformation this solution brings. Use bright, optimistic colors while maintaining professionalism. Include subtle AI/technology elements. Style: modern, solution-oriented, inspiring, high-tech business imagery.

Context: 各世代の価値観・行動パターンをAIが詳細分析。個人差も考慮した精密なプロファイリングで、一人ひとりに最適なアプローチを提案します。
Service: ai-bridge (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-bridge/public/images/generated/solution-1.jpg として保存してください。
```

---

### 9. solution画像: solution-2.jpg

**優先度**: medium
**出力ファイル名**: solution-2.jpg
**保存先**: `services/ai-bridge/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Create a positive, forward-looking image (500x400px) that represents the innovative solution: "リアルタイム・コミュニケーション支援". Show the benefits and transformation this solution brings. Use bright, optimistic colors while maintaining professionalism. Include subtle AI/technology elements. Style: modern, solution-oriented, inspiring, high-tech business imagery.

Context: 面談や会議の場面で、相手の世代に応じた最適な表現方法をリアルタイムでアドバイス。その場で使える実践的なサポートを提供します。
Service: ai-bridge (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-bridge/public/images/generated/solution-2.jpg として保存してください。
```

---

### 10. solution画像: solution-3.jpg

**優先度**: medium
**出力ファイル名**: solution-3.jpg
**保存先**: `services/ai-bridge/public/images/generated/`

**Claude Desktopでのプロンプト**:
```
Create a positive, forward-looking image (500x400px) that represents the innovative solution: "多様性を活かすチーム設計". Show the benefits and transformation this solution brings. Use bright, optimistic colors while maintaining professionalism. Include subtle AI/technology elements. Style: modern, solution-oriented, inspiring, high-tech business imagery.

Context: 各世代の強みを最大化するプロジェクト配置とチーム編成をAI提案。世代間の相乗効果で生産性を劇的に向上させます。
Service: ai-bridge (AI-powered business solution)
Quality: Professional business use, web-optimized
Format: JPEG or PNG, suitable for web display
No text overlays or embedded text in the image.

生成後、画像を services/ai-bridge/public/images/generated/solution-3.jpg として保存してください。
```

---

## 生成後の作業

1. **画像最適化**: 生成された画像のファイルサイズを確認し、必要に応じて最適化
2. **設定更新**: config.jsonの画像パスを新しい生成画像に更新
3. **バックアップ**: 既存のプレースホルダー画像をbackupディレクトリに移動
4. **テスト**: ローカル環境で画像表示を確認

## 生成完了チェックリスト

- [ ] hero: hero-bridge
- [ ] problem: problem-understanding
- [ ] problem: problem-guidance
- [ ] problem: problem-conflict
- [ ] problem: problem-evaluation
- [ ] problem: problem-meeting
- [ ] problem: problem-change
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
node scripts/integrate-generated-images.js ai-bridge
```
