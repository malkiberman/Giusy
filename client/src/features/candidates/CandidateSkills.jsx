import styles from './CandidateAnalysis.module.css';

function availabilityLabel(value) {
  if (value === 0 || value === "0") return 'לא צוין / מיידי';
  return value === 1 || value === "1" ? 'זמין' : value;
}

function relativeLabel(value) {
  return value === 1 || value === "1" ? 'כן' : 'לא';
}

function InfoRow({ label, value }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '0.625rem 0.75rem', 
      borderRadius: '8px', 
      background: '#f8f9fc', 
      border: '1px solid #e2e6ef' 
    }}>
      <strong style={{ color: '#5a6178', fontSize: '0.85rem', fontWeight: 600 }}>{label}</strong>
      <span style={{ color: '#1a1a2e', fontWeight: 700, fontSize: '0.85rem' }}>{value}</span>
    </div>
  );
}

export default function CandidateSkills({ candidate }) {
  const technical = candidate?.technical || candidate?.analysis?.technical || {};

  return (
    <div className={styles.card}>
      <h3 className={styles.sectionTitle}>פרטים טכניים</h3>
      <div style={{ display: 'grid', gap: '0.5rem' }}>
        <InfoRow 
          label="מיקום" 
          value={technical.location === 0 ? 'לא צוין' : (technical.location || 'לא ידוע')} 
        />
        <InfoRow 
          label="זמינות" 
          value={availabilityLabel(technical.availability)} 
        />
        <InfoRow 
          label="קרוב משפחה בחברה" 
          value={relativeLabel(technical.hasRelativeInCompany)} 
        />
      </div>
    </div>
  );
}
