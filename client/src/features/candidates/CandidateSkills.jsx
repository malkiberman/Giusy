import styles from './CandidateAnalysis.module.css';

function availabilityLabel(value) {
  // באובייקט שלך חוזר 0, נהפוך אותו לטקסט ידידותי
  if (value === 0 || value === "0") return 'לא צוין / מיידי';
  return value === 1 || value === "1" ? 'זמין' : value;
}

function relativeLabel(value) {
  return value === 1 || value === "1" ? 'כן' : 'לא';
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
  // הגנה: חילוץ האובייקט הטכני בין אם הוא בתוך analysis ובין אם הוא ישיר
  const technical = candidate?.technical || candidate?.analysis?.technical || {};

  return (
    <div className={styles.card}>
      <h3 className={styles.sectionTitle}>פרטים טכניים</h3>
      <div style={{ display: 'grid', gap: '0.65rem' }}>
        {/* תיקון: שימוש ב-location במקום locationLabel ובדיקה אם הוא 0 */}
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