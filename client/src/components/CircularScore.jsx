import { useState, useEffect } from 'react';
import { scoreColor } from '../config/constants';

const SIZE_CONFIG = {
  large: { 
    px: 150, 
    cx: 75, 
    radius: 55, 
    strokeWidth: 8, 
    fontSize: '2.5rem', 
    subFontSize: '0.875rem', 
    showSub: true, 
    transitionDuration: '1.8s',
    glowSize: '16px'
  },
  medium: { 
    px: 100, 
    cx: 50, 
    radius: 38, 
    strokeWidth: 6, 
    fontSize: '1.75rem', 
    subFontSize: '0.75rem', 
    showSub: true, 
    transitionDuration: '1.5s',
    glowSize: '10px'
  },
  small: { 
    px: 70, 
    cx: 35, 
    radius: 26, 
    strokeWidth: 4, 
    fontSize: '1.25rem', 
    subFontSize: null, 
    showSub: false, 
    transitionDuration: '1.2s',
    glowSize: '6px'
  },
};

export default function CircularScore({ score, size = 'large', label }) {
  const [animated, setAnimated] = useState(false);
  const cfg = SIZE_CONFIG[size] || SIZE_CONFIG.large;

  useEffect(() => { 
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Protection against NaN or invalid values
  const safeScore = (score !== null && score !== undefined && !isNaN(Number(score))) ? Number(score) : 0;
  
  const circumference = 2 * Math.PI * cfg.radius;
  const percentage = Math.min((safeScore / 100) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const color = scoreColor(safeScore);
  
  // Gradient ID for unique gradients
  const gradientId = `scoreGradient-${size}-${safeScore}`;

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '0.75rem' 
    }}>
      <div style={{ 
        position: 'relative', 
        width: `${cfg.px}px`, 
        height: `${cfg.px}px`,
      }}>
        {/* Background glow effect */}
        <div style={{
          position: 'absolute',
          inset: '10%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
          filter: 'blur(8px)',
          opacity: animated ? 1 : 0,
          transition: 'opacity 0.8s ease',
        }} />
        
        <svg 
          width={cfg.px} 
          height={cfg.px} 
          style={{ 
            transform: 'rotate(-90deg)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e285a" />
              <stop offset="100%" stopColor="#ff375c" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Background track */}
          <circle 
            cx={cfg.cx} 
            cy={cfg.cx} 
            r={cfg.radius} 
            fill="none" 
            stroke="#e5e7eb" 
            strokeWidth={cfg.strokeWidth}
            opacity="0.5"
          />
          
          {/* Background track inner shadow */}
          <circle 
            cx={cfg.cx} 
            cy={cfg.cx} 
            r={cfg.radius - cfg.strokeWidth / 2} 
            fill="none" 
            stroke="#f3f4f6" 
            strokeWidth={1}
            opacity="0.3"
          />
          
          {/* Progress arc */}
          <circle
            cx={cfg.cx}
            cy={cfg.cx}
            r={cfg.radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={cfg.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={animated ? strokeDashoffset : circumference}
            strokeLinecap="round"
            filter="url(#glow)"
            style={{
              transition: `stroke-dashoffset ${cfg.transitionDuration} cubic-bezier(0.34, 1.56, 0.64, 1)`,
            }}
          />
        </svg>
        
        {/* Center content */}
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          textAlign: 'center',
          zIndex: 2,
        }}>
          <div style={{ 
            fontSize: cfg.fontSize, 
            fontWeight: 900, 
            background: 'linear-gradient(135deg, #1e285a 0%, #ff375c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            {Math.round(safeScore)}
          </div>
          {cfg.showSub && (
            <div style={{ 
              fontSize: cfg.subFontSize, 
              color: '#9ca3af', 
              marginTop: '4px',
              fontWeight: 600,
            }}>
              / 100
            </div>
          )}
        </div>
      </div>
      
      {label && (
        <div style={{
          fontSize: '0.8125rem',
          fontWeight: 700,
          color: '#1e285a',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}>
          {label}
        </div>
      )}
    </div>
  );
}
