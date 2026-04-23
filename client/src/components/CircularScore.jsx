import { useState, useEffect } from 'react';
import { scoreColor } from '../config/constants';

const SIZE_CONFIG = {
  large: { px: 130, cx: 65, radius: 42, strokeWidth: 4, fontSize: '2rem', subFontSize: '0.7rem', showSub: true, transitionDuration: '1.2s' },
  small: { px: 76, cx: 38, radius: 26, strokeWidth: 3, fontSize: '1.2rem', subFontSize: null, showSub: false, transitionDuration: '1s' },
};

export default function CircularScore({ score, size = 'large' }) {
  const [animated, setAnimated] = useState(false);
  const cfg = SIZE_CONFIG[size] || SIZE_CONFIG.large;

  useEffect(() => { setAnimated(true); }, []);

  const safeScore = (score !== null && score !== undefined && !isNaN(Number(score))) ? Number(score) : 0;
  
  const circumference = 2 * Math.PI * cfg.radius;
  const percentage = Math.min((safeScore / 100) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const color = scoreColor(safeScore);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div style={{ position: 'relative', width: `${cfg.px}px`, height: `${cfg.px}px` }}>
        <svg width={cfg.px} height={cfg.px} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle 
            cx={cfg.cx} 
            cy={cfg.cx} 
            r={cfg.radius} 
            fill="none" 
            stroke="#e2e6ef" 
            strokeWidth={cfg.strokeWidth} 
          />
          {/* Progress circle */}
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
              filter: `drop-shadow(0 0 ${size === 'large' ? '8px' : '4px'} ${color}25)`,
            }}
          />
        </svg>
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          textAlign: 'center' 
        }}>
          <div style={{ 
            fontSize: cfg.fontSize, 
            fontWeight: 800, 
            color, 
            lineHeight: 1 
          }}>
            {Math.round(safeScore)}
          </div>
          {cfg.showSub && (
            <div style={{ 
              fontSize: cfg.subFontSize, 
              color: '#5a6178', 
              marginTop: '2px',
              fontWeight: 600
            }}>
              / 100
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
