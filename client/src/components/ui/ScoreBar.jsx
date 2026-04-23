import { scoreColor } from '../../config/constants';

export default function ScoreBar({ score }) {
  const color = scoreColor(score);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <div style={{ 
        flex: 1, 
        height: '6px', 
        background: '#e2e6ef', 
        borderRadius: '9999px', 
        minWidth: '80px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          width: `${score}%`, 
          height: '100%', 
          background: color, 
          borderRadius: '9999px', 
          transition: 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)' 
        }} />
      </div>
      <span style={{ 
        fontWeight: 700, 
        color, 
        fontSize: '0.875rem', 
        minWidth: '40px',
        textAlign: 'left'
      }}>
        {score}%
      </span>
    </div>
  );
}
