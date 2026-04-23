// Brand colors for Direct Insurance
export const BRAND_COLORS = {
  primary: '#ff375c',
  primaryLight: '#ff5a7a',
  navy: '#1e285a',
  navyLight: '#2d3a6e',
};

export const PRIORITY_COLORS = {
  high: { background: '#d1fae5', color: '#059669' },
  medium: { background: '#fff0f3', color: '#ff375c' },
  low: { background: '#fee2e2', color: '#dc2626' },
};

export const PRIORITY_LABELS = { high: 'גבוהה', medium: 'בינונית', low: 'נמוכה' };

export const PARAM_COLORS = {
  High: { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669' },
  Medium: { bg: 'rgba(255, 55, 92, 0.08)', color: '#ff375c' },
  Low: { bg: 'rgba(220, 38, 38, 0.08)', color: '#dc2626' },
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
  if (score > 80) return '#059669'; // success green
  if (score >= 50) return '#ff375c'; // brand primary (coral)
  return '#dc2626'; // error red
}
