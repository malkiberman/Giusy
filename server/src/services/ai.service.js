const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

async function sendPromptAndQaFromEnv(questions = [], answers = []) {
  const googleKey = process.env.GOOGLE_API_KEY;
  if (!googleKey) throw new Error('Missing GOOGLE_API_KEY');

  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${googleKey}`;

  let basePrompt = '';

  const possiblePaths = [
    path.join(__dirname, '..', 'prompts', 'prompt'),
    '/opt/render/project/src/server/src/prompts/prompt'
  ];

  for (const p of possiblePaths) {
    try {
      basePrompt = await fs.readFile(p, 'utf8');
      console.log(`✅ Prompt loaded from: ${p}`);
      break;
    } catch (err) {
      // ממשיכים לנסות נתיב אחר
    }
  }

  if (!basePrompt) {
    console.warn('⚠️ Using fallback prompt');
    basePrompt =
      "נתח את הראיון הבא. החזר JSON בלבד עם: scores, summary, insights.";
  }

  const interviewData = questions
    .map((q, i) => {
      return `Question ${i + 1}: ${q}\nAnswer ${i + 1}: ${answers[i] || 'No answer provided'}`;
    })
    .join('\n\n');

  const fullText = `${basePrompt}

Interview Data:
${interviewData}

Return STRICT JSON only.`;

  const payload = {
    contents: [
      {
        parts: [{ text: fullText }]
      }
    ]
  };

  try {
    const resp = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    const candidate = resp?.data?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('❌ Invalid Gemini response:', JSON.stringify(resp.data, null, 2));
      throw new Error('Empty response from Gemini');
    }

    return text;
  } catch (error) {
    if (error.response) {
      console.error('❌ Gemini API Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('❌ Request Error:', error.message);
    }

    throw new Error('AI processing failed');
  }
}

module.exports = { sendPromptAndQaFromEnv };