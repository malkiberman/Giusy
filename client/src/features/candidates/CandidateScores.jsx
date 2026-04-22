import styles from './CandidateAnalysis.module.css';
import CircularScore from '../../components/CircularScore';
import { SCORE_KEY_LABELS } from '../../config/constants';

export default function CandidateScores({ candidate }) {
  return (
    <div className={styles.card}>
      <h3 className={styles.sectionTitle}>כישורים וכישרונות</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '1.5rem' }}>
        {Object.entries(candidate.scores || {}).map(([key, value]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <CircularScore score={Number(value) || 0} size="small" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4b5563', textAlign: 'center', lineHeight: 1.2 }}>
              {SCORE_KEY_LABELS[key] || key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
