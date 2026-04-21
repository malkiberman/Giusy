// 🔹 parseJsonResponse
function parseJsonResponse(aiResponse) {
  if (!aiResponse) throw new Error('Empty AI response');

  try {
    // אם כבר אובייקט
    if (typeof aiResponse === 'object') return aiResponse;

    // ניקוי markdown אם קיים (```json ...)
    const cleaned = aiResponse
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[parseJsonResponse] Failed to parse:', aiResponse);
    throw new Error('AI returned invalid JSON');
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