function QAButton({ gradient, shadowColor, icon, title, subtitle, onClick }) {
  const shadow = `0 8px 24px rgba(${shadowColor}, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)`;
  const shadowHover = `0 16px 40px rgba(${shadowColor}, 0.5)`;

  return (
    <button
      onClick={onClick}
      style={{
        padding: '1.8rem',
        background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        border: 'none',
        borderRadius: '14px',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        boxShadow: shadow,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
        e.currentTarget.style.boxShadow = shadowHover;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = shadow;
      }}
    >
      <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <div style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.3rem' }}>{title}</div>
      <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{subtitle}</div>
    </button>
  );
}

export default function CandidateQA({ candidate, setModal }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', position: 'sticky', top: '20px' }}>
      <QAButton
        gradient={['#7c3aed', '#a855f7']}
        shadowColor="124, 58, 237"
        icon="📝"
        title="סיכום AI"
        subtitle="ניתוח מפורט של התשובות"
        onClick={() => setModal({ title: 'סיכום AI', content: candidate.aiSummary || 'אין סיכום זמין', color: '#6d28d9', icon: '📝' })}
      />
      <QAButton
        gradient={['#f59e0b', '#fbbf24']}
        shadowColor="245, 158, 11"
        icon="💡"
        title="שאלות המשך"
        subtitle="מומלצות"
        onClick={() => setModal({ title: 'שאלות המשך מומלצות', questions: candidate.recommendedQuestions, color: '#d97706', icon: '💡' })}
      />
      <QAButton
        gradient={['#2563eb', '#1e40af']}
        shadowColor="37, 99, 235"
        icon="❓"
        title="שאלות ותשובות"
        subtitle="מן הראיון"
        onClick={() => setModal({ title: 'שאלות ותשובות מהראיון', conversation: { answers: candidate.qa || [] }, chatMode: true, color: '#2563eb', icon: '❓' })}
      />
    </div>
  );
}
