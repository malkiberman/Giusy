import { useState, useEffect } from 'react';
import { scoreColor } from '../config/constants';

const SIZE_CONFIG = {
  large: { px: 140, cx: 70, radius: 45, strokeWidth: 3, fontSize: '2.2rem', subFontSize: '0.75rem', showSub: true, transitionDuration: '1.5s' },
  small: { px: 80, cx: 40, radius: 28, strokeWidth: 2, fontSize: '1.3rem', subFontSize: null, showSub: false, transitionDuration: '1.3s' },
};

export default function CircularScore({ score, size = 'large' }) {
  const [animated, setAnimated] = useState(false);
  const cfg = SIZE_CONFIG[size] || SIZE_CONFIG.large;

  useEffect(() => { setAnimated(true); }, []);

  // הגנה מפני NaN או ערכים לא תקינים
  const safeScore = (score !== null && score !== undefined && !isNaN(Number(score))) ? Number(score) : 0;
  
  const circumference = 2 * Math.PI * cfg.radius;
  const percentage = Math.min((safeScore / 100) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const color = scoreColor(safeScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ position: 'relative', width: `${cfg.px}px`, height: `${cfg.px}px` }}>
        <svg width={cfg.px} height={cfg.px} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cfg.cx} cy={cfg.cx} r={cfg.radius} fill="none" stroke="#f3f0ff" strokeWidth={cfg.strokeWidth} />
          <circle
            cx={cfg.cx}
            cy={cfg.cx}
            r={cfg.radius}
            fill="none"
            stroke={color}
            strokeWidth={cfg.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={animated ? strokeDashoffset : circumference}
            strokeLinecap="round"
            style={{
              transition: `stroke-dashoffset ${cfg.transitionDuration} cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
              filter: `drop-shadow(0 0 ${size === 'large' ? '10px' : '6px'} ${color}30)`,
            }}
          />
        </svg>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <div style={{ fontSize: cfg.fontSize, fontWeight: 800, color, lineHeight: 1 }}>
            {Math.round(safeScore)}
          </div>
          {cfg.showSub && (
            <div style={{ fontSize: cfg.subFontSize, color: '#7c6f8e', marginTop: '2px' }}>/ 100</div>
          )}
        </div>
      </div>
    </div>
  );
}
