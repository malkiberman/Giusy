// src/services/ai.service.js
require('dotenv').config();
const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

async function sendPromptAndQaFromEnv(questions = [], answers = []) {
  const googleKey = process.env.GOOGLE_API_KEY;
  if (!googleKey) throw new Error('Missing GOOGLE_API_KEY in environment');

  // שינוי המודל וה-URL לגרסה היציבה
  const model = 'gemini-1.5-flash'; 
  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${googleKey}`;

  // קריאת ה-Prompt מהקובץ
  let basePrompt = '';
  try {
    const promptPath = path.join(__dirname, '..', '..', 'prompt'); // ודאי שהנתיב לקובץ ה-prompt נכון
    basePrompt = await fs.readFile(promptPath, 'utf8');
  } catch (err) {
    console.error('Could not read prompt file, using default');
    basePrompt = 'Analyze the following interview:';
  }

  // בניית הפרומפט המלא
  let fullPrompt = basePrompt.trim();
  fullPrompt += '\n\nQuestions:\n' + questions.join('\n');
  fullPrompt += '\n\nAnswers:\n' + answers.join('\n');

  const payload = {
    contents: [{ parts: [{ text: fullPrompt }] }],
    generationConfig: {
      responseMimeType: "application/json" // זה מכריח אותו להחזיר JSON
    }
  };

  try {
    const resp = await axios.post(url, payload, { timeout: 20000 });
    
    // שליפת הטקסט לפי המבנה של Gemini
    if (resp.data && resp.data.candidates && resp.data.candidates[0].content) {
      return resp.data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Unexpected response structure from Google AI');
  } catch (err) {
    // הדפסת השגיאה המפורטת כדי שנדע אם המפתח לא תקין
    console.error('AI API Error:', err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendPromptAndQaFromEnv };