function QAButton({ gradient, shadowColor, icon, title, subtitle, onClick }) {
  const shadow = `0 6px 20px rgba(${shadowColor}, 0.25)`;
  const shadowHover = `0 12px 32px rgba(${shadowColor}, 0.35)`;

  return (
    <button
      onClick={onClick}
      style={{
        padding: '1.5rem',
        background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
        border: 'none',
        borderRadius: '14px',
        color: '#fff',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        boxShadow: shadow,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
        e.currentTarget.style.boxShadow = shadowHover;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = shadow;
      }}
    >
      <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{icon}</div>
      <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.25rem' }}>{title}</div>
      <div style={{ fontSize: '0.75rem', opacity: 0.9, fontWeight: 500 }}>{subtitle}</div>
    </button>
  );
}

export default function CandidateQA({ candidate, setModal }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '20px' }}>
      <QAButton
        gradient={['#1e285a', '#2d3a6e']}
        shadowColor="30, 40, 90"
        icon="AI"
        title="סיכום AI"
        subtitle="ניתוח מפורט של התשובות"
        onClick={() => setModal({ title: 'סיכום AI', content: candidate.aiSummary || 'אין סיכום זמין', color: '#1e285a', icon: 'AI' })}
      />
      <QAButton
        gradient={['#ff375c', '#ff5a7a']}
        shadowColor="255, 55, 92"
        icon="?"
        title="שאלות המשך"
        subtitle="מומלצות"
        onClick={() => setModal({ title: 'שאלות המשך מומלצות', questions: candidate.recommendedQuestions, color: '#ff375c', icon: '?' })}
      />
      <QAButton
        gradient={['#059669', '#10b981']}
        shadowColor="5, 150, 105"
        icon="Q"
        title="שאלות ותשובות"
        subtitle="מן הראיון"
        onClick={() => setModal({ title: 'שאלות ותשובות מהראיון', conversation: { answers: candidate.qa || [] }, chatMode: true, color: '#059669', icon: 'Q' })}
      />
    </div>
  );
}
