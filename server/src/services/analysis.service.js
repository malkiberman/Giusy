const AnalysisRepository = require('../repositories/analysis.repository');
const CandidateRepository = require('../repositories/candidate.repository');

class AnalysisService {
  async createAnalysis(candidateId, aiResults) {
    // 1. שמירת הניתוח בטבלת ה-Analysis
    const analysis = await AnalysisRepository.create({
      candidateId,
      ...aiResults
    });

    // 2. עדכון המועמד - קישור לניתוח ושינוי סטטוס
    await CandidateRepository.update(candidateId, {
      analysis: analysis._id,
      status: 'analyzed'
    });

    return analysis;
  }

  async getAnalysisByCandidate(candidateId) {
    return await AnalysisRepository.findByCandidateId(candidateId);
  }
}

module.exports = new AnalysisService();