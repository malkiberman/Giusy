// Brand colors - Bituach Yashir
export const BRAND_COLORS = {
  primary: '#1e285a',
  primaryLight: '#2d3a6e',
  accent: '#ff375c',
  accentLight: '#ff5a7a',
};

export const PRIORITY_COLORS = {
  high: { background: '#ecfdf5', color: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
  medium: { background: '#fff0f3', color: '#ff375c', border: 'rgba(255, 55, 92, 0.2)' },
  low: { background: '#fef2f2', color: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' },
};

export const PRIORITY_LABELS = { high: 'גבוהה', medium: 'בינונית', low: 'נמוכה' };

export const PARAM_COLORS = {
  High: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Medium: { bg: 'rgba(255, 55, 92, 0.08)', color: '#ff375c' },
  Low: { bg: 'rgba(239, 68, 68, 0.08)', color: '#ef4444' },
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
  if (score >= 80) return '#10b981'; // Green for high scores
  if (score >= 50) return '#ff375c'; // Accent pink for medium
  return '#ef4444'; // Red for low
}

export function getScoreGradient(score) {
  if (score >= 80) return 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
  if (score >= 50) return 'linear-gradient(135deg, #1e285a 0%, #ff375c 100%)';
  return 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
}

// Role labels
export const ROLE_LABELS = [
  'לא מתאים',
  'נציג שירות',
  'נציג מכירות',
  'מנהל צוות',
  'מנהל מחלקה',
];

// Location labels
export const LOCATION_LABELS = [
  'לא צוין',
  'מרכז',
  'צפון',
  'דרום',
  'ירושלים',
  'שרון',
];

// Availability labels
export const AVAILABILITY_LABELS = [
  'לא צוין',
  'מיידי',
  'שבועיים',
  'חודש',
  'יותר מחודש',
];
