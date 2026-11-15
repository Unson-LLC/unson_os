export function mapPushCaseStageToNocoStatus(stage: string): string {
  const mapping: Record<string, string> = {
    diagnosis_submitted: 'リード',
    booked: '初回接触',
    discovery: 'ヒアリング',
    qualified: 'ヒアリング',
    proposed: '提案済み',
    negotiating: '商談中',
    won: '受注',
    lost: '失注',
    recycled: '保留',
    paused: '保留',
  };

  return mapping[stage] || 'リード';
}

export function mapProbabilityToNocoAngle(probability: number): string {
  if (probability >= 0.95) return '★★★★★ (95%)';
  if (probability >= 0.75) return '★★★★☆ (75%)';
  if (probability >= 0.5) return '★★★☆☆ (50%)';
  if (probability >= 0.3) return '★★☆☆☆ (30%)';
  return '★☆☆☆☆ (10%)';
}
