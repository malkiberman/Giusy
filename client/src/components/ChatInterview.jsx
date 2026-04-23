import { useEffect, useState, useRef } from 'react';
import { interviewQuestions } from '../config/interviewQuestions';
import { useSpeechRecorder } from '../hooks/useSpeechRecorder';
import { useAudioRecorder } from '../hooks/useAudioRecorder.js'; // להוסיף
import useInterview from '../hooks/useInterview';
import { uploadAudioFile } from '../services/api'; // להוסיף

export default function ChatInterview({ onConversationEnd, candidateInfo }) {
  const bottomRef = useRef(null);
  const [allRecordings, setAllRecordings] = useState([]); 

  // 1. הוק הקלטת אודיו (Blob ל-S3)
  const { 
    isRecording: isAudioRec, // שינינו ל-isAudioRec
    audioBlob, 
    startRecording, 
    stopRecording 
  } = useAudioRecorder();

  // 2. הוק תמלול (Speech to Text)
  const {
    isRecording: isSpeechRec, // שינינו ל-isSpeechRec
    transcript: speechTranscript, 
    interim: speechInterim,       
    supported: isSpeechSupported, 
    error: speechError,           
    start: startSpeech,
    stop: stopSpeech,
    reset: resetSpeech,           
  } = useSpeechRecorder('he-IL');

  // 3. הוק ניהול הראיון
  const {
    messages,
    answers,
    input,
    setInput,
    currentIndex,
    done,
    submitting,
    submitError,
    handleSend,
    handleSubmit,
  } = useInterview({ candidateInfo, onConversationEnd, reset: resetSpeech });

  // --- useEffect-ים מתוקנים ---

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, speechInterim]); // שונה ל-speechInterim

  useEffect(() => {
    if (isSpeechRec) { // שונה ל-isSpeechRec
      setInput(`${speechTranscript}${speechInterim ? ` ${speechInterim}` : ''}`.trim());
    }
  }, [speechTranscript, speechInterim, isSpeechRec, setInput]);

  useEffect(() => {
    if (audioBlob) {
      setAllRecordings(prev => [...prev, audioBlob]);
    }
  }, [audioBlob]);

  // פונקציית הקלטה מתוקנת
  function handleRecordClick() {
    if (isAudioRec) { // שונה ל-isAudioRec
      stopRecording();
      stopSpeech((final) => setInput(final));
    } else {
      setInput('');
      startRecording();
      startSpeech();
    }
  }
  const handleFinalSubmit = async () => {
    let finalAudioUrl = null;

    try {
      if (allRecordings.length > 0) {
        // מוצאים את ההקלטה הכי ארוכה
        const longestBlob = allRecordings.reduce((prev, current) =>
          (prev.size > current.size) ? prev : current
        );

        // מעלים ל-S3 - וודאי ששלחת את המייל ב-candidateInfo
        const email = candidateInfo?.email || 'candidate';
        finalAudioUrl = await uploadAudioFile(longestBlob, email);
      }

      // שליחה סופית לשרת דרך ה-Hook
      await handleSubmit(finalAudioUrl);
    } catch (err) {
      console.error("שגיאה בסיום הראיון:", err);
    }
  };

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  const isInputDisabled = done || isAudioRec || submitting;

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerAvatar}>מיטל</div>
          <div>
            <div style={styles.headerName}>מיטל - מראיינת </div>
            <div style={styles.headerSub}>ראיון אוטומטי למועמד</div>
          </div>
        </div>

        <div style={styles.headerRight}>
          {isAudioRec ? (
            <div style={styles.recIndicator}>
              <span style={styles.recDot} />
              מקליט...
            </div>
          ) : null}

          <div
            style={{
              ...styles.progressChip,
              background: done ? '#d1fae5' : '#f8f9fc',
              color: done ? '#059669' : '#1e285a',
              border: done ? '1px solid #6ee7b7' : '1px solid #e2e6ef',
            }}
          >
            {done ? 'הסתיים' : `${Math.min(currentIndex + 1, interviewQuestions.length)} / ${interviewQuestions.length}`}
          </div>
        </div>
      </div>

      <div style={styles.feed}>
        {messages.map((msg, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-start' : 'flex-end' }}>
            {msg.from === 'bot' ? <div style={styles.botAvatar}>מיטל</div> : null}
            <div style={msg.from === 'bot' ? styles.botBubble : styles.userBubble}>{msg.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {!isSpeechSupported ? (
        <div style={styles.warning}>זיהוי דיבור אינו נתמך בדפדפן זה. מומלץ Chrome או Edge.</div>
      ) : null}
      {speechError ? <div style={styles.warning}>{speechError}</div> : null}
      {submitError ? <div style={styles.error}>{submitError}</div> : null}

      {/* אזור הקלט או כפתור סיום */}
      {done ? (
        <div style={{ padding: '1.25rem 1.5rem', background: '#faf8fc', borderTop: '2px solid #d4d0dc', textAlign: 'center' }}>
          <button
            onClick={handleFinalSubmit}
            disabled={submitting}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #1f3563, #2d4a80)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(31,53,99,0.2)',
              opacity: submitting ? 0.7 : 1
            }}
          >
            {submitting ? 'מעבד ושומר נתונים...' : 'לחץ כאן לסיום ושליחת הראיון'}
          </button>
        </div>
      ) : (
        <div style={styles.inputRow}>
          <div
            style={{
              ...styles.textareaWrap,
              border: isAudioRec ? '2px solid #d4a017' : '2px solid #d4d0dc',
              boxShadow: isAudioRec ? '0 0 0 3px rgba(212,160,23,0.18)' : 'none',
            }}
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isSpeechRec ? 'מאזין...' : 'הקלד/י תשובה...'}

              style={{ ...styles.textarea, color: isSpeechRec ? '#e83b7c' : '#1f1535' }} disabled={isInputDisabled}
            />

            {/* כפתור הקלטה */}
<button
  onClick={handleRecordClick}
  style={{
    ...styles.recBtn,
    // כאן התיקון: משתמשים ב-isAudioRec כדי להפעיל את האנימציה
    animation: isAudioRec ? 'recPulse 1.2s ease-in-out infinite' : 'none',
    background: isAudioRec ? '#ff375c' : '#f0f2f5',
  }}
  title={isAudioRec ? 'עצור הקלטה' : 'הקלט תשובה'}
>
  {/* כאן התיקון: אם מקליטים (isAudioRec), מציגים ריבוע עצירה. אם לא, מציגים מיקרופון */}
  {isAudioRec ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#65676b">
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  )}
</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '700px',
    height: '700px',
    background: '#fff',
    borderRadius: '20px',
    border: '1px solid #e2e6ef',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(30,40,90,0.1)',
  },
  finalSubmitBtn: {
    width: '100%',
    padding: '1rem',
    background: 'linear-gradient(135deg, #1f3563, #2d4a80)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(31,53,99,0.2)',
    transition: 'transform 0.2s',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 1.75rem',
    borderBottom: '1px solid #e2e6ef',
    background: 'linear-gradient(to right, #f8f9fc, #fff)',
    flexShrink: 0,
    position: 'relative',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
  },
  headerAvatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e285a, #2d3a6e)',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 0 3px #ff375c, 0 0 0 6px rgba(255,55,92,0.1)',
    flexShrink: 0,
  },
  headerName: { fontWeight: 700, fontSize: '1rem', color: '#1a1a2e', lineHeight: 1.3 },
  headerSub: { fontSize: '0.8rem', color: '#5a6178', marginTop: '2px' },
  progressChip: {
    padding: '0.3rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.02em',
    transition: 'background 0.2s, color 0.2s',
  },
  recIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#ff375c',
    background: 'rgba(255,55,92,0.08)',
    padding: '0.25rem 0.6rem',
    borderRadius: '9999px',
    border: '1px solid rgba(255,55,92,0.2)',
  },
  recDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#ff375c',
    display: 'inline-block',
    animation: 'recPulse 1s ease-in-out infinite',
  },
  feed: {
    flex: 1,
    overflowY: 'auto',
    padding: '1.75rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.125rem',
    background: '#f8f9fc',
  },
  botAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e285a, #2d3a6e)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    alignSelf: 'flex-end',
    marginLeft: '0.75rem',
    marginBottom: '3px',
  },
  botBubble: {
    maxWidth: '85%',
    background: '#fff',
    border: '1px solid #e2e6ef',
    color: '#1a1a2e',
    padding: '0.875rem 1.25rem',
    borderRadius: '16px 0 16px 16px',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    fontWeight: 500,
    boxShadow: '0 2px 6px rgba(30,40,90,0.04)',
  },
  userBubble: {
    maxWidth: '85%',
    background: 'linear-gradient(135deg, #ff375c, #ff5a7a)',
    color: '#fff',
    padding: '0.875rem 1.25rem',
    borderRadius: '16px 16px 16px 0',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    fontWeight: 500,
    boxShadow: '0 2px 8px rgba(255,55,92,0.2)',
  },
  warning: {
    background: '#fef3c7',
    color: '#92400e',
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
    textAlign: 'center',
  },
  error: {
    background: '#fee2e2',
    color: '#b91c1c',
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
    textAlign: 'center',
  },
  inputRow: {
    display: 'flex',
    gap: '0.8rem',
    padding: '1.25rem 1.5rem',
    borderTop: '1px solid #e2e6ef',
    background: '#fff',
    alignItems: 'flex-end',
  },
  textareaWrap: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    borderRadius: '12px',
    background: '#fff',
    border: '2px solid #e2e6ef',
    transition: 'border 0.2s, box-shadow 0.2s',
    overflow: 'hidden',
  },
  textarea: {
    flex: 1,
    padding: '0.75rem 3.5rem 0.75rem 1rem',
    border: 'none',
    outline: 'none',
    fontSize: '0.95rem',
    resize: 'none',
    fontFamily: 'inherit',
    background: 'transparent',
    lineHeight: 1.6,
    color: '#1a1a2e',
    height: '60px',
    overflowY: 'auto',
  },
  recBtn: {
    position: 'absolute',
    left: '0.65rem',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    background: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'box-shadow 0.15s',
    padding: 0,
  },
};
