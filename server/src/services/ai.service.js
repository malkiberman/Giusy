const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

async function sendPromptAndQaFromEnv(questions = [], answers = []) {
  const googleKey = process.env.GOOGLE_API_KEY;
  if (!googleKey) throw new Error('Missing GOOGLE_API_KEY');

  // שינוי ל-v1beta - הגרסה הזו תומכת ב-1.5 flash בצורה הכי יציבה
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleKey}`;

  // 1. הנתיב שהוכחנו שעובד מה-Log שלך
  let basePrompt = '';
  try {
    const promptPath = path.join(__dirname, '..', 'prompts', 'prompt');
    basePrompt = await fs.readFile(promptPath, 'utf8');
    console.log('✅ Prompt loaded successfully from verified path');
  } catch (err) {
    console.warn('⚠️ Fallback used for prompt');
    basePrompt = "נתח את הראיון הבא והחזר JSON בלבד.";
  }

  // 2. בניית הטקסט
  const fullText = `${basePrompt}\n\nReturn ONLY a valid JSON object.\n\nQuestions:\n${questions.join('\n')}\n\nAnswers:\n${answers.join('\n')}`;

  const payload = {
    contents: [{
      parts: [{ text: fullText }]
    }]
  };

  try {
    const resp = await axios.post(url, payload);
    
    if (resp.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return resp.data.candidates[0].content.parts[0].text;
    }
    throw new Error('Invalid response structure from AI');
  } catch (err) {
    // הדפסת שגיאה מפורטת למקרה של תקלה נוספת
    console.error('AI API Error Detail:', JSON.stringify(err.response?.data || err.message));
    throw err;
  }
}

module.exports = { sendPromptAndQaFromEnv };