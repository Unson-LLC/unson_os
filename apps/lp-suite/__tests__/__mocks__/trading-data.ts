export const mockEventDetails = {
  eventId: 'event-1',
  timestamp: '2025-08-30T10:00:00Z',
  type: 'optimization',
  title: 'モック最適化イベント',
  description: 'テスト用の最適化イベント詳細'
}

export const mockAIAnalysis = {
  analysis: 'モック分析結果',
  recommendations: ['推奨事項1', '推奨事項2'],
  confidence: 0.85
}

export const mockTradingData = {
  events: [mockEventDetails],
  analysis: [mockAIAnalysis]
}