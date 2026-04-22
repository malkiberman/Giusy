const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

async function sendPromptAndQaFromEnv(questions = [], answers = []) {
  const googleKey = process.env.GOOGLE_API_KEY;
  if (!googleKey) throw new Error('Missing GOOGLE_API_KEY');

  // שימוש בשם המודל המדויק והנקי ביותר עבור v1beta
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${googleKey}`;

  let basePrompt = '';
  try {
    // תיקון נתיב: אנחנו בתוך src/services, הקובץ נמצא ב-src/prompts/prompt
    const promptPath = path.join(__dirname, '..', 'prompts', 'prompt');
    basePrompt = await fs.readFile(promptPath, 'utf8');
    console.log('✅ Prompt loaded successfully');
  } catch (err) {
    console.warn('⚠️ Fallback used - could not find prompt file at:', path.join(__dirname, '..', 'prompts', 'prompt'));
    basePrompt = "Analyze the interview performance. Return ONLY a valid JSON object.";
  }

  // בניית הטקסט עבור ה-AI
  const fullText = `
${basePrompt}

Interview Data:
${questions.map((q, i) => `Question ${i + 1}: ${q}\nAnswer ${i + 1}: ${answers[i] || 'No answer'}`).join('\n\n')}

IMPORTANT: Return ONLY valid JSON.
`;

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
      throw new Error('Empty response from Gemini');
    }

    return resp.data.candidates[0].content.parts[0].text;
  } catch (error) {
    // הדפסה מפורטת ללוג של Render במקרה של כישלון
    if (error.response) {
      console.error('❌ AI API Error Detail:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ AI API Error:', error.message);
    }
    throw new Error('AI processing failed');
  }
}

module.exports = { sendPromptAndQaFromEnv };