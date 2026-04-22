const axios = require('axios');
const { log } = require('console');
const fs = require('fs/promises');
const path = require('path');

function resolveEnvFilePath(envKey) {
  const rawPath = process.env.PROMPT_FILE_PATH;
  if (!rawPath) return null;
  return path.isAbsolute(rawPath) ? rawPath : path.join(__dirname, '..', '..', rawPath);
}

async function sendPromptAndQaFromEnv(questions = [], answers = []) {
  const googleKey = process.env.GOOGLE_API_KEY;
  if (!googleKey) throw new Error('Missing GOOGLE_API_KEY');

  // שינוי ל-v1beta - הגרסה הזו תומכת ב-1.5 flash בצורה הכי יציבה
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${googleKey}`;  // 1. הנתיב שהוכחנו שעובד מה-Log שלך
  let basePrompt = '';
  try {
    const promptPath = path.join(__dirname, '..', 'prompts', 'prompt');
    basePrompt = await fs.readFile(promptPath, 'utf8');
    console.log('✅ Prompt loaded successfully from verified path');
  } catch (err) {
    console.warn('⚠️ Fallback used for prompt');
    basePrompt = "נתח את הראיון הבא והחזר JSON בלבד.";
  }
    //basePrompt = await fs.readFile(promptPath, 'utf8').catch(() => '');
  // console.log('!!!!!!', basePrompt);
  }

  // Build the full prompt
   let fullPrompt = basePrompt;
  console.log('*****fullPrompt prompt :', basePrompt,'-------');
  if (questions && questions.length) {
    fullPrompt += '\n\nQuestions:\n' + questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
  }
  if (answers && answers.length) {
    fullPrompt += '\n\nAnswers:\n' + answers.map((a, i) => `${i + 1}. ${a}`).join('\n');
  }

  const payload = {
    contents: [{
      parts: [{ text: fullText }]
    }]
  };

  try {
const resp = await axios.post(url, payload, {
  headers: {
    'Content-Type': 'application/json',
    'X-goog-api-key': googleKey
  }
});    
    if (resp.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return resp.data.candidates[0].content.parts[0].text;
    }
    throw new Error('Invalid response structure from AI');
  } catch (err) {
    // הדפסת שגיאה מפורטת למקרה של תקלה נוספת
    console.error('AI API Error Detail:', JSON.stringify(err.response?.data || err.message));
    throw err;
  }


module.exports = { sendPromptAndQaFromEnv };