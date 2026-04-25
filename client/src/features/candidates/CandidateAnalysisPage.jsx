import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './CandidateAnalysis.module.css';
import RTLLayout from '../../components/layout/RTLLayout';
import useCandidate from '../../hooks/useCandidate';
import CandidateHeader from './CandidateHeader';
import CandidateScores from './CandidateScores';
import CandidateSkills from './CandidateSkills';
import CandidateQA from './CandidateQA';
import Modal from '../../components/Modal';

export default function CandidateAnalysis() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { candidate, loading, error } = useCandidate(id);
  const [modal, setModal] = useState(null);

  if (loading) {
    return (
      <div className={styles.page}>
        <div>טוען נתונים...</div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className={styles.page}>
        <div>
          <p>{error || 'מועמד לא נמצא.'}</p>
          <button onClick={() => navigate('/dashboard')}>חזרה ללוח הבקרה</button>
        </div>
      </div>
    );
  }

  return (
    <RTLLayout className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/dashboard')}>
        חזרה ללוח הבקרה
      </button>

      <CandidateHeader candidate={candidate} />

      <CandidateScores candidate={candidate} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', alignItems: 'start' }}>
        <div>
          <CandidateSkills candidate={candidate} />
        </div>
        <CandidateQA candidate={candidate} setModal={setModal} />
      </div>

      {modal && <Modal modal={modal} onClose={() => setModal(null)} />}
    </RTLLayout>
  );
}
