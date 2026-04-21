require('dotenv').config();
const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');

function resolveEnvFilePath(envKey) {
  const rawPath = process.env[envKey];
  if (!rawPath) return null;
  return path.isAbsolute(rawPath) ? rawPath : path.join(__dirname, '..', '..', rawPath);
}

async function sendPromptAndQaFromEnv(questions = [], answers = []) {
  const googleKey = process.env.GOOGLE_API_KEY;
  if (!googleKey) throw new Error('Missing GOOGLE_API_KEY in environment');

  const model = process.env.GENAI_MODEL || 'gemma-3-4b-it';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${googleKey}`;

  // Read prompt file if specified
  let basePrompt = '';
  const promptPath = resolveEnvFilePath('PROMPT_FILE_PATH');
  if (promptPath) {
    basePrompt = await fs.readFile(promptPath, 'utf8').catch(() => '');
  }

  // Build the full prompt
  let fullPrompt = (basePrompt || '').trim();
  if (questions && questions.length) {
    fullPrompt += '\n\nQuestions:\n' + questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
  }
  if (answers && answers.length) {
    fullPrompt += '\n\nAnswers:\n' + answers.map((a, i) => `${i + 1}. ${a}`).join('\n');
  }

  const payload = {
    contents: [{ parts: [{ text: fullPrompt }] }]
  };

  try {
    const resp = await axios.post(url, payload, { timeout: 20000 });
    const text = resp?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text === 'string') return text;
    return resp.data;
  } catch (err) {
    const msg = err?.response?.data || err?.message || String(err);
    const e = new Error('Generative API request failed: ' + (typeof msg === 'string' ? msg : JSON.stringify(msg)));
    e.details = msg;
    throw e;
  }
}

module.exports = { sendPromptAndQaFromEnv };
