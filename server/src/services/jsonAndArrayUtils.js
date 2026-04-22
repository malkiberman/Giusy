// 🔹 parseJsonResponse
// src/services/jsonAndArrayUtils.js
function parseJsonResponse(aiResponse) {
  if (!aiResponse) throw new Error('Empty AI response');
  if (typeof aiResponse === 'object') return aiResponse;

  try {
    // ניקוי יסודי של סימני Markdown ותווים בלתי נראים
    const cleaned = aiResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // הסרת תווים מיוחדים
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error('Failed to parse AI response. Raw text:', aiResponse);
    // החזרת אובייקט ברירת מחדל כדי שהמערכת לא תקרוס
    return { 
      score: 0, 
      feedback: "שגיאה בפענוח תשובת ה-AI",
      scores: { motivation: 0, verbalAbility: 0, peopleSkills: 0, salesOrientation: 0, targetOrientation: 0 }
    };
  }
}

function buildRawAnswersMap(answers) {
  if (!Array.isArray(answers)) return {};

  const map = {};
  answers.forEach((ans, index) => {
    map[`q${index + 1}`] = ans;
  });

  return map;
}


function buildScoreArrays(analysis) {
  const scores = analysis?.scores || {};

  // weights - כרגע hard coded (אפשר להוציא לקובץ בעתיד)
  const weights = {
    motivation: 0.2,
    verbalAbility: 0.2,
    peopleSkills: 0.2,
    salesOrientation: 0.2,
    targetOrientation: 0.2
  };

  const scoreValues = [];
  const weightValues = [];

  for (const key of Object.keys(weights)) {
    scoreValues.push(Number(scores[key] ?? 0));
    weightValues.push(weights[key]);
  }

  return { scoreValues, weightValues };
}

module.exports = {
  parseJsonResponse,
  buildRawAnswersMap,
  buildScoreArrays
};