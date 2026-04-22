const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

async function sendPromptAndQaFromEnv(questions = [], answers = []) {
  const googleKey = process.env.GOOGLE_API_KEY;
  if (!googleKey) throw new Error('Missing GOOGLE_API_KEY');

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${googleKey}`;

  // 1. תיקון הנתיב לתיקיית data
  let basePrompt = '';
  try {
    // process.cwd() זה שורש הפרויקט + תיקיית data + שם הקובץ prompt
    const promptPath = path.join(process.cwd(), 'data', 'prompt'); 
    basePrompt = await fs.readFile(promptPath, 'utf8');
    console.log('✅ Prompt file loaded from /data/prompt');
  } catch (err) {
    console.warn('⚠️ Could not find prompt in /data/prompt, using fallback');
    basePrompt = "Analyze the interview and return a JSON object with scores and feedback.";
  }

  // 2. בניית הטקסט - הוספתי הוראה מפורשת ל-JSON כאן כדי לעקוף את השגיאה הקודמת
  const fullText = `${basePrompt}\n\nIMPORTANT: Return ONLY a valid JSON object.\n\nQuestions:\n${questions.join('\n')}\n\nAnswers:\n${answers.join('\n')}`;

  const payload = {
    contents: [{
      parts: [{ text: fullText }]
    }]
    // הסרתי את generationConfig כי ה-API ב-Render עושה איתו בעיות
  };

  try {
    const resp = await axios.post(url, payload);
    
    if (resp.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return resp.data.candidates[0].content.parts[0].text;
    }
    throw new Error('Invalid response structure from AI');
  } catch (err) {
    console.error('AI API Error:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendPromptAndQaFromEnv };