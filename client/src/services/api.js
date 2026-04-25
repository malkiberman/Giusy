import { normalizeCandidate, normalizeCandidates } from '../utils/candidateViewModel';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// פונקציית העזר הקיימת שלך - אל תשני אותה
async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const err = new Error(data?.message || `HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }

  return data;
}

// --- פונקציות ה-API המעודכנות ---

/**
 * שלב 1: יצירת מועמד חדש (בדף הנחיתה)
 * מחזיר את המועמד מה-DB כולל ה-_id שלו
 */
export async function createCandidate(payload) {
  const data = await request('/api/candidates', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  
  // במקום לסמוך על ה-Normalize המורכב, נחזיר את האובייקט כמו שהוא + ID שטוח
  return {
    ...data,
    id: data._id || data.id // מבטיח שיהיה שדה id פשוט
  };
}

/**
 * שלב 2: שליחת תשובות הראיון לניתוח (בסוף הראיון)
 * מקשר בין ה-ID הקיים לתשובות החדשות
 */


/**
 * שליפת כל המועמדים (עבור דף הניהול/Admin)
 */
export async function fetchCandidates() {
  const data = await request('/api/candidates');
  const list = Array.isArray(data) ? data : data?.candidates || [];
  return normalizeCandidates(list);
}

/**
 * שליפת מועמד ספציפי כולל הניתוח שלו - קריאה מאוחדת
 * משתמשת ב-normalizeCandidate לנרמול מלא של הנתונים
 */
export async function fetchCandidateById(id) {
  const data = await request(`/api/candidates/${id}`);
  return normalizeCandidate(data);
}
// פונקציה תומכת אחורנית למי שעדיין משתמש בשם הישן
export const submitInterview = async (payload) => {
    // אם הקוד הישן שלכן שולח אובייקט עם candidateId, נתמוך בזה
    return await submitInterviewAnalysis(payload.candidateId, payload.answers, payload.audioKey);
};



// api.js

export async function uploadAudioFile(audioBlob, candidateEmail) {
  if (!audioBlob) return null;

  const formData = new FormData();
  // שם הקובץ יהיה המייל של המועמד (למשל: test@gmail.com.webm)
  const fileName = `${candidateEmail.replace(/[^a-zA-Z0-9]/g, '_')}.webm`; 
  formData.append('candidateId', candidateId);
  // השרת מקבל את זה כסטרינג בגלל ה-FormData
  formData.append('answers', JSON.stringify(answers)); 
  
  if (audioBlob) {
    formData.append('audio', audioBlob, 'interview_audio.webm');
  }

  const response = await fetch(`${BASE_URL}/api/analysis`, { 
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('העלאת הקלטה נכשלה');
  
  const data = await response.json();
  return data.url; // השרת צריך להחזיר את הקישור הסופי ב-S3
}

// עדכון פונקציית שליחת הראיון שתקבל גם את ה-audioUrl
export async function submitInterviewAnalysis(candidateId, answers, audioKey = null) {
  return await request('/api/analysis', {
    method: 'POST',
    body: JSON.stringify({ 
      candidateId, 
      answers, 
      audioKey // הוספת הקישור לגוף הבקשה
    }),
  });
}


// api.js

/**
 * שליחת הראיון המאוחד לשרת (טקסט + אודיו)
 */
/**
 * שליחת הראיון המאוחד לשרת (טקסט + אודיו)
 * מתואם ל-AnalysisController.createAnalysis בשרת
 */
// services/api.js

// services/api.js

export async function submitUnifiedInterview(candidateId, answers, audioBlob) {
  const formData = new FormData();
  
  formData.append('candidateId', candidateId);

  // התיקון: אנחנו שולחים רק את המחרוזות של התשובות כדי להתאים ל-Schema ב-DB
  // במקום לשלוח מערך אובייקטים, אנחנו שולחים מערך של טקסטים בלבד
  const simpleAnswers = answers.map(a => a.answer); 
  
  // הפיכה ל-JSON string כפי שהקונטרולר מצפה
  formData.append('answers', JSON.stringify(simpleAnswers));

  if (audioBlob) {
    // שליחת הקובץ תחת השם 'audio' כפי שמוגדר ב-Router (upload.single("audio"))
    formData.append('audio', audioBlob, 'recording.webm');
  }

  const response = await fetch(`${BASE_URL}/api/analysis`, {
    method: 'POST',
    body: formData,
    // חשוב: לא להוסיף Headers של Content-Type, ה-Browser עושה זאת אוטומטית ל-FormData
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'העלאת הנתונים נכשלה');
  }
  
  return await response.json();
}