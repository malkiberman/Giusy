const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

async function sendPromptAndQaFromEnv(questions = [], answers = []) {
  const googleKey = process.env.GOOGLE_API_KEY;
  if (!googleKey) throw new Error('Missing GOOGLE_API_KEY');

  // תיקון ה-URL: שימוש ב-gemini-1.5-flash-latest
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleKey}`;

  let basePrompt = '';
  try {
    const promptPath = path.join(__dirname, '..', 'prompts', 'prompt');
    basePrompt = await fs.readFile(promptPath, 'utf8');
    console.log('✅ Prompt loaded successfully');
  } catch (err) {
    console.warn('⚠️ Fallback used for prompt');
    basePrompt = "Analyze the interview. Return ONLY a valid JSON object with scores, summary, and insights.";
  }

  // בניית הטקסט המלא
  let fullText = basePrompt;
  if (questions.length) {
    fullText += '\n\nQuestions:\n' + questions.join('\n');
  }
  if (answers.length) {
    fullText += '\n\nAnswers:\n' + answers.join('\n');
  }

  const payload = {
    contents: [{
      parts: [{ text: fullText }]
    }]
  };

  try {
    const resp = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!resp.data.candidates || !resp.data.candidates[0]) {
      throw new Error('No response from Gemini API');
    }

    return resp.data.candidates[0].content.parts[0].text;
  } catch (error) {
    // הדפסת השגיאה המפורטת כדי שנוכל לראות אם יש בעיה אחרת
    console.error('❌ AI API Error Detail:', error.response?.data || error.message);
    throw new Error('AI processing failed');
  }
}

module.exports = { sendPromptAndQaFromEnv };