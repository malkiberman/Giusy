import { useEffect, useState } from 'react';
import { interviewIntro, interviewQuestions } from '../config/interviewQuestions';
import { submitInterviewAnalysis } from '../services/api';

const DONE_MESSAGE = 'תודה רבה 🙏 הראיון נשמר בהצלחה ונחזור אליך בהקדם.';

export default function useInterview({ candidateInfo, onConversationEnd, reset }) {
  const [messages, setMessages] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [input, setInput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    setMessages([{ from: 'bot', text: interviewIntro }, { from: 'bot', text: interviewQuestions[0].text }]);
  }, []);

  function pushBot(text) {
    setMessages((prev) => [...prev, { from: 'bot', text }]);
  }

async function handleSubmit(audioUrlFromComponent = null) {
  const candidateId = candidateInfo?._id || candidateInfo?.id;

  if (!candidateId) {
    setSubmitError('לא נמצא מזהה מועמד.');
    return;
  }

  try {
  
    setSubmitting(true);
    
    // וודאי שהמערך נבנה נכון מה-state הנוכחי של answers
    const plainAnswersForServer = answers.map(({ questionId, answer }) => ({
      questionId,
      answer,
    }));

    // הקריאה ל-API (שלב הניתוח)
    const result = await submitInterviewAnalysis(
      candidateId, 
      plainAnswersForServer, 
      audioUrlFromComponent // ה-URL מה-S3 עובר כאן
    );
    pushBot(DONE_MESSAGE);
    onConversationEnd?.({ ...candidateInfo, _id: candidateId, analysis: result });
    setDone(true);

  } catch (error) {
    setSubmitError(error.message || 'לא הצלחנו לשמור את התשובות.');
  } finally {
    setSubmitting(false);
  }
}

  function submitAnswer(text) {
    const trimmed = text.trim();
    if (!trimmed || done) return;

    const activeQuestion = interviewQuestions[currentIndex];
    const newAnswers = [
      ...answers,
      { questionId: activeQuestion.id, question: activeQuestion.text, answer: trimmed },
    ];

    setMessages((prev) => [...prev, { from: 'user', text: trimmed }]);
    setAnswers(newAnswers);
    setInput('');
    reset();

    const nextIndex = currentIndex + 1;
    if (nextIndex < interviewQuestions.length) {
      setCurrentIndex(nextIndex);
      setTimeout(() => pushBot(interviewQuestions[nextIndex].text), 350);
      return;
    }

    // שינוי כאן: רק מסמנים שסיימנו, לא קוראים ל-handleSubmit אוטומטית
    setDone(true); 
    // מחקנו את השורה שקוראת ל-handleSubmit(newAnswers);
  }

  function handleSend() {
    if (!input.trim() || done) return;
    submitAnswer(input);
  }

  return {
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
  };
}



