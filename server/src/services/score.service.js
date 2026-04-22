function calculateFinalScore(scores, weights) {
  if (!Array.isArray(scores) || !Array.isArray(weights)) {
    throw new Error('Both scores and weights must be arrays.');
  }

  const length = Math.min(scores.length, weights.length);
  let finalScore = 0;

  for (let i = 0; i < length; i += 1) {
    const score = scores[i];
    const weight = weights[i];

    if (score === null || score === undefined) continue;

    const numericScore = Number(score);
    const numericWeight = Number(weight);
    if (Number.isNaN(numericScore) || Number.isNaN(numericWeight)) continue;

    // Support weights as fractions (0..1) or percentages (0..100).
    // Treat weight 1 or 100 as a mandatory flag: if score falsy -> final 0.
    if (numericWeight === 100 || numericWeight === 1) {
      if (numericScore === 0) return 0;
      // mandatory, but count normally below
    }

    const multiplier = numericWeight <= 1 ? numericWeight : numericWeight / 100;
    finalScore += numericScore * multiplier;
  }

  return finalScore;
}

module.exports = { calculateFinalScore };