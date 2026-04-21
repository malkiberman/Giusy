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
  // payload: { fullName, email, phone }
  const data = await request('/api/candidates', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return normalizeCandidate(data);
}

/**
 * שלב 2: שליחת תשובות הראיון לניתוח (בסוף הראיון)
 * מקשר בין ה-ID הקיים לתשובות החדשות
 */
export async function submitInterviewAnalysis(candidateId, answers) {
  // שולחים ל-endpoint של ה-analysis את ה-ID והתשובות
  const data = await request('/api/analysis', {
    method: 'POST',
    body: JSON.stringify({ candidateId, answers }),
  });
  return data; // מחזיר את אובייקט הניתוח (Analysis)
}

/**
 * שליפת כל המועמדים (עבור דף הניהול/Admin)
 */
export async function fetchCandidates() {
  const data = await request('/api/candidates');
  const list = Array.isArray(data) ? data : data?.candidates || [];
  return normalizeCandidates(list);
}

/**
 * שליפת מועמד ספציפי כולל הניתוח שלו
 */
export async function fetchCandidateById(id) {
  const candidate = await request(`/api/candidates/${id}`);
  
  try {
    const analysis = await request(`/api/analysis/${id}`);
    return normalizeCandidate({ ...candidate, analysis });
  } catch {
    // אם אין עדיין ניתוח, מחזירים רק את המועמד
    return normalizeCandidate(candidate);
  }
}

// פונקציה תומכת אחורנית למי שעדיין משתמש בשם הישן
export const submitInterview = async (payload) => {
    // אם הקוד הישן שלכן שולח אובייקט עם candidateId, נתמוך בזה
    return await submitInterviewAnalysis(payload.candidateId, payload.answers);
};