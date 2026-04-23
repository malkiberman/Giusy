import styles from './CandidateAnalysis.module.css';
import CircularScore from '../../components/CircularScore';
import { PRIORITY_COLORS, PRIORITY_LABELS } from '../../config/constants';

export default function CandidateHeader({ candidate }) {
  return (
    <div className={styles.top}>
      <div className={styles.card}>
        <div className={styles.avatar}>{candidate.fullName.charAt(0)}</div>
        <div style={{ flex: 1 }}>
          <h2 className={styles.candidateName}>{candidate.fullName}</h2>
          <div className={styles.contacts}>
            <span>Tel: {candidate.phone || '-'}</span>
            <span>Email: {candidate.email || '-'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
          <span className={styles.priorityBadge} style={PRIORITY_COLORS[candidate.priority] || PRIORITY_COLORS.low}>
            {PRIORITY_LABELS[candidate.priority] || candidate.priority}
          </span>
          <span className={styles.priorityBadge} style={{ background: '#f1f4f9', color: '#1e285a', border: '1px solid #e2e6ef' }}>
            {candidate.recommendedRoleLabel}
          </span>
        </div>
      </div>

      <div className={styles.scoreCard}>
        <CircularScore score={candidate.score} />
        <p className={styles.scoreLabel}>ציון התאמה</p>
      </div>

      <div className={styles.scoreCard}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '130px',
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 800,
            color: '#1e285a',
            lineHeight: 1,
            marginBottom: '0.4rem',
          }}>
            {candidate.experienceLevel}/3
          </div>
        </div>
        <p className={styles.scoreLabel}>רמת ניסיון</p>
      </div>
    </div>
  );
}
