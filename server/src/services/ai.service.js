const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

async function sendPromptAndQaFromEnv(questions = [], answers = []) {
  const googleKey = process.env.GOOGLE_API_KEY;
  if (!googleKey) throw new Error('Missing GOOGLE_API_KEY');

  // שימוש ב-URL היציב ביותר
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${googleKey}`;

  // 1. תיקון קריאת קובץ ה-Prompt (מנסה למצוא אותו בתיקיית השורש של הפרויקט)
  let basePrompt = '';
  try {
    // הולך 2 תיקיות אחורה מ-services לתיקיית השורש שבה נמצא קובץ ה-prompt
    const promptPath = path.join(__dirname, '..', '..', 'prompt'); 
    basePrompt = await fs.readFile(promptPath, 'utf8');
    console.log('✅ Prompt file loaded successfully');
  } catch (err) {
    console.warn('⚠️ Could not read prompt file from:', err.path, '- using hardcoded fallback');
    basePrompt = "Analyze the following interview and return ONLY a JSON object with scores and feedback.";
  }

  // בניית הפרומפט
  const fullText = `${basePrompt}\n\nQuestions:\n${questions.join('\n')}\n\nAnswers:\n${answers.join('\n')}`;

  const payload = {
    contents: [{ parts: [{ text: fullText }] }],
    generationConfig: {
      // כאן התיקון הקריטי לשגיאה 400 - שימוש בפורמט שגוגל מקבלת
      response_mime_type: "application/json" 
    }
  };

  try {
    const resp = await axios.post(url, payload);
    
    if (resp.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return resp.data.candidates[0].content.parts[0].text;
    }
    throw new Error('Invalid response structure from AI');
  } catch (err) {
    // הדפסת שגיאה מפורטת לטרמינל כדי שתוכלי לראות אם יש בעיה אחרת
    console.error('AI API Error:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendPromptAndQaFromEnv };