const AnalysisRepository = require('../repositories/analysis.repository');
const CandidateRepository = require('../repositories/candidate.repository');
const { createConversationEntity } = require('./analysisConversation.service');

class AnalysisService {

async analyzeAndCreateConversation(candidateId, answers, audioFile  = null) {
  console.log("SERVICE audioFile:", audioFile);
  // 🔹 1. יצירת ניתוח מלא מה-AI
  const analysisData = await createConversationEntity(candidateId, answers, audioFile);

  // 🔹 2. שמירה ב-DB
  const analysis = await AnalysisRepository.create({
    candidateId,
    ...analysisData
  });

  // 🔹 3. עדכון מועמד
  await CandidateRepository.update(candidateId, {
    analysis: analysis._id,
    status: 'analyzed'
  });

  return analysis;
}

//   //עדכון לאחר ניתוח השיחה
//   async updateAnalysisById(analysisId, updateData) {
//   const updatedAnalysis = await AnalysisRepository.findByIdAndUpdate(
//     analysisId,
//     {
//       $set: {
//         technical: updateData.technical,
//         scores: updateData.scores,
//         experienceLevel: updateData.experienceLevel,
//         recommendedRole: updateData.recommendedRole,
//         finalScore: updateData.finalScore,
//         summary: updateData.summary,
//         insights: updateData.insights,
//         recommendedQuestions: updateData.recommendedQuestions
//       }
//     },
//     { new: true }
//   );

//   if (!updatedAnalysis) {
//     throw new Error('Analysis not found');
//   }

//   return updatedAnalysis;
// }
  async getAnalysisByCandidate(candidateId) {
    return await AnalysisRepository.findByCandidateId(candidateId);
  }
}

module.exports = new AnalysisService();