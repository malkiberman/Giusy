import { scoreColor } from '../../config/constants';

export default function ScoreBar({ score }) {
  const color = scoreColor(score);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{ flex: 1, height: '5px', background: '#f3f0ff', borderRadius: '999px', minWidth: '80px' }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: '999px', transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontWeight: 700, color, fontSize: '0.88rem', minWidth: '36px' }}>{score}%</span>
    </div>
  );
}
