const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

async function sendPromptAndQaFromEnv(questions = [], answers = []) {
  const googleKey = process.env.GOOGLE_API_KEY;
  if (!googleKey) throw new Error('Missing GOOGLE_API_KEY');

  // ניסיון להשתמש ב-gemini-pro אם ה-flash מחזיר 404 ב-v1beta
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${googleKey}`;

  let basePrompt = '';
  
  // ניסיון לזהות את הנתיב הנכון ב-Render לפי הודעת השגיאה שלך
  const possiblePaths = [
    path.join(__dirname, '..', 'prompts', 'prompt'), // נתיב פיתוח
    '/opt/render/project/src/server/src/prompts/prompt' // נתיב ייצור ב-Render
  ];

  for (const p of possiblePaths) {
    try {
      basePrompt = await fs.readFile(p, 'utf8');
      console.log(`✅ Prompt loaded successfully from: ${p}`);
      break; 
    } catch (err) {
      continue;
    }
  }

  if (!basePrompt) {
    console.warn('⚠️ No prompt file found, using hardcoded instructions');
    basePrompt = "נתח את הראיון הבא. החזר אובייקט JSON עם השדות: scores (אובייקט), summary (מחרוזת), insights (מערך).";
  }

  // בניית הטקסט עבור ה-AI - פורמט ברור יותר
  const interviewData = questions.map((q, i) => {
    return `Question ${i + 1}: ${q}\nAnswer ${i + 1}: ${answers[i] || 'No answer provided'}`;
  }).join('\n\n');

  const fullText = `${basePrompt}\n\nInterview Data to Analyze:\n${interviewData}\n\nStrictly return valid JSON only.`;

  const payload = {
    contents: [{
      parts: [{ text: fullText }]
    }]
  };

  try {
    const resp = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (!resp.data.candidates || !resp.data.candidates[0] || !resp.data.candidates[0].content) {
      console.error('❌ Unexpected API Response:', JSON.stringify(resp.data));
      throw new Error('Invalid response from Gemini API');
    }

    return resp.data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error.response) {
      console.error('❌ AI API Error Detail:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ AI API Error Message:', error.message);
    }
    throw new Error('AI processing failed');
  }
}

module.exports = { sendPromptAndQaFromEnv };