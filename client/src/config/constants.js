export const PRIORITY_COLORS = {
  high: { bg: '#dcfce7', color: '#16a34a' },
  medium: { bg: '#fff7ed', color: '#ea580c' },
  low: { bg: '#fee2e2', color: '#dc2626' },
};

export const PRIORITY_LABELS = { high: 'גבוהה', medium: 'בינונית', low: 'נמוכה' };

export const PARAM_COLORS = {
  High: { bg: 'rgba(22,163,74,0.12)', color: '#15803d' },
  Medium: { bg: 'rgba(212,160,23,0.14)', color: '#92600a' },
  Low: { bg: 'rgba(220,38,38,0.1)', color: '#b91c1c' },
};

export const PARAM_VALUE_LABELS = { High: 'גבוה', Medium: 'בינוני', Low: 'נמוך' };

export const SCORE_KEY_LABELS = {
  motivation: 'מוטיבציה',
  verbalAbility: 'וורבליות',
  peopleSkills: 'כישורים בין אישיים',
  salesOrientation: 'אוריינטציה מכירתית',
  targetOrientation: 'אוריינטציה ליעדים',
};

export function scoreColor(score) {
  if (score > 80) return '#16a34a';
  if (score >= 50) return '#d4a017';
  return '#dc2626';
}
