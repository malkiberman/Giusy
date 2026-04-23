const { sendPromptAndQaFromEnv } = require('./ai.service');
const fs = require('fs/promises');
const path = require('path');
const { parseJsonResponse, buildRawAnswersMap, buildScoreArrays } = require('./jsonAndArrayUtils');
const { calculateFinalScore } = require('./score.service');
const { sendAudioToPython } = require('./pythonAnalysis.service');

async function createConversationEntity(candidateId, answers, audioFile = null) {
  if (!candidateId) throw new Error('candidateId is required.');
  if (!Array.isArray(answers) || answers.length === 0) {
    throw new Error('answers must be a non-empty array');
  }


  //כל עניין ניתוח הקול
  let audioFeatures = null;

  if (audioFile) {
    audioFeatures = await sendAudioToPython(audioFile, answers);
  }

  // 🔹 1. שליפת שאלות
  const qaFilePath =
    process.env.QA_FILE_PATH ||
    path.join(__dirname, '..', '..', 'data', 'questions.json');

  const content = await fs.readFile(qaFilePath, 'utf8');
  const data = JSON.parse(content);

  if (Array.isArray(data)) {
    questions = data.map(q => q.question || q);
  } else if (Array.isArray(data.questions)) {
    questions = data.questions;
  } else {
    throw new Error('Invalid questions format');
  }


  // 🔹 2. קריאה ל-AI
  let aiRaw;
  try {
    aiRaw = await sendPromptAndQaFromEnv(
      questions,
      answers,
      audioFeatures
    );

  } catch (err) {
    console.error('[AI ERROR]', err?.message || err);
    throw new Error('AI processing failed');
  }

  // 🔹 3. פרסור תשובה
  const analysis = parseJsonResponse(aiRaw);

  // 🔹 4. נרמול נתונים (הגנה על null / undefined)
  const technical = analysis?.technical ?? {};
  const scores = analysis?.scores ?? {};

  const experienceLevel = Number(analysis?.experienceLevel ?? 0);
  const recommendedRole = analysis?.recommendedRole ?? 0;

  const summary = analysis?.summary ?? '';
  const insights = Array.isArray(analysis?.insights) ? analysis.insights : [];
  const recommendedQuestions = Array.isArray(analysis?.recommendedQuestions)
    ? analysis.recommendedQuestions
    : [];

  // 🔹 5. חישוב ציון סופי
  let finalScore = 0;

  if (technical.location === 0 || technical.availability === 0) {
    finalScore = 0;
  } else {
    try {
      const { scoreValues, weightValues } = buildScoreArrays({ scores });
      finalScore = calculateFinalScore(scoreValues, weightValues);
    } catch (err) {
      console.warn('[Score Calculation Failed]', err?.message);
      finalScore = 0;
    }
  }

  // 🔹 6. בניית entity
  return {
    timestamp: new Date().toISOString(),

    answers: [...answers],
    rawAnswers: buildRawAnswersMap(answers),

    technical,
    scores,
    experienceLevel,
    finalScore,
    recommendedRole,

    summary,
    insights,
    recommendedQuestions
  };
}

module.exports = { createConversationEntity };

