import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import ChatInterview from '../components/ChatInterview';
import CompletionPage from './CompletionPage';
import styles from './InterviewPage.module.css';
import { CURRENT_CANDIDATE_KEY as LS_KEY } from '../config/storageKeys';

export default function InterviewPage() {
  const [savedCandidate, setSavedCandidate] = useState(null);

  const candidateInfo = (() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || 'null'); }
    catch { return null; }
  })();

  if (!candidateInfo?.fullName) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {savedCandidate ? (
        <CompletionPage candidateInfo={candidateInfo} savedCandidate={savedCandidate} />
      ) : (
        <div className={styles.page} dir="rtl">
          <AppHeader subtitle={`ברוך הבא, ${candidateInfo.fullName}`} />

          <div className={styles.body}>
            <ChatInterview
              candidateInfo={candidateInfo}
              onConversationEnd={(candidate) => setSavedCandidate(candidate)}
            />
          </div>
        </div>
      )}
    </>
  );
}
