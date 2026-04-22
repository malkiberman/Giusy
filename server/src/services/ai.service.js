const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

async function sendPromptAndQaFromEnv(questions = [], answers = []) {
  const googleKey = process.env.GOOGLE_API_KEY;
  if (!googleKey) throw new Error('Missing GOOGLE_API_KEY');

  // תיקון ה-URL (הוספנו models/ בשביל v1)
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${googleKey}`;

  // 1. נתיב מדויק לפי ה-find שלך: server/src/prompts/prompt
  let basePrompt = '';
  try {
    // __dirname נמצא בתוך server/src/services
    // לכן נלך צעד אחד אחורה ל-src ואז ל-prompts
    const promptPath = path.join(__dirname, '..', 'prompts', 'prompt');
    
    basePrompt = await fs.readFile(promptPath, 'utf8');
    console.log('✅ Success: Prompt loaded from:', promptPath);
  } catch (err) {
    console.warn('⚠️ Could not find prompt at specified path, using hardcoded fallback');
    basePrompt = "אתה עוזר גיוס. נתח את הראיון והחזר JSON עם scores ו-feedback.";
  }

  // 2. בניית הטקסט (הוראה ל-JSON בגוף הטקסט לעקיפת שגיאת 400)
  const fullText = `${basePrompt}\n\nReturn ONLY a valid JSON object. No markdown.\n\nQuestions:\n${questions.join('\n')}\n\nAnswers:\n${answers.join('\n')}`;

  const payload = {
    contents: [{ parts: [{ text: fullText }] }]
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