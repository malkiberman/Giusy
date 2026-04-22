import styles from './CandidateAnalysis.module.css';

function availabilityLabel(value) {
  return Number(value) === 1 ? 'זמין' : 'לא זמין / לא צוין';
}

function relativeLabel(value) {
  return Number(value) === 1 ? 'כן' : 'לא';
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.7rem', borderRadius: '8px', background: '#faf8ff', border: '1px solid #ede9fe' }}>
      <strong style={{ color: '#4b5563', fontSize: '0.87rem' }}>{label}</strong>
      <span style={{ color: '#1f1535', fontWeight: 700, fontSize: '0.87rem' }}>{value}</span>
    </div>
  );
}

export default function CandidateSkills({ candidate }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.sectionTitle}>פרטים טכניים</h3>
      <div style={{ display: 'grid', gap: '0.65rem' }}>
        <InfoRow label="מיקום" value={candidate.technical.locationLabel} />
        <InfoRow label="זמינות" value={availabilityLabel(candidate.technical.availability)} />
        <InfoRow label="קרוב משפחה בחברה" value={relativeLabel(candidate.technical.hasRelativeInCompany)} />
      </div>
    </div>
  );
}
