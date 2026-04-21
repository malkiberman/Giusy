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
            <span>📞 {candidate.phone || '-'}</span>
            <span>✉️ {candidate.email || '-'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'flex-end' }}>
          <span className={styles.priorityBadge} style={PRIORITY_COLORS[candidate.priority] || PRIORITY_COLORS.low}>
            עדיפות {PRIORITY_LABELS[candidate.priority] || candidate.priority}
          </span>
          <span className={styles.priorityBadge} style={{ background: '#ede9fe', color: '#6d28d9' }}>
            תפקיד: {candidate.recommendedRoleLabel}
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
          height: '140px',
        }}>
          <div style={{
            fontSize: '3.5rem',
            fontWeight: 900,
            color: '#6d28d9',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}>
            {candidate.experienceLevel}/3
          </div>
          <div style={{
            fontSize: '0.75rem',
            color: '#7c6f8e',
            fontWeight: 600,
          }}>

          </div>
        </div>
        <p className={styles.scoreLabel}>רמת ניסיון</p>
      </div>
    </div>
  );
}
