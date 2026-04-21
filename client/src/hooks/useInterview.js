import { useEffect, useState } from 'react';
import { interviewIntro, interviewQuestions } from '../config/interviewQuestions';
import { submitInterview } from '../services/api';

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

  async function handleSubmit(finalAnswers) {
    const candidateId = candidateInfo?.email || candidateInfo?.fullName || `candidate-${Date.now()}`;

    const payload = {
      candidateId,
      candidate: {
        fullName: candidateInfo?.fullName || '',
        email: candidateInfo?.email || '',
        phone: candidateInfo?.phone || '',
      },
      answers: finalAnswers.map((a) => a.answer),
    };

    console.log('🎤 [ראיון מסתיים] שליחה לשרת:');
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    setSubmitting(true);
    setSubmitError('');

    try {
      console.log('⏳ שליחה לשרת...');
      const savedCandidate = await submitInterview(payload);
      console.log('✅ התגובה מהשרת:', savedCandidate);
      pushBot(DONE_MESSAGE);
      onConversationEnd?.(savedCandidate);
    } catch (error) {
      console.error('❌ שגיאה בשלח הראיון:', error);
      setSubmitError('לא הצלחנו לשמור את הראיון כרגע. נסה/י שוב בעוד כמה דקות.');
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

    setDone(true);
    handleSubmit(newAnswers);
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
