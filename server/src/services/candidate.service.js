const CandidateRepo = require('../repositories/candidate.repository');
// const AiService = require('./ai.service'); // רותי תבנה את זה

class CandidateService {
  async registerCandidate(data) {
    // לוגיקה נוספת לפני שמירה אם צריך
    return await CandidateRepo.create(data);
  }

  async processAnswers(id, answers) {
    // 1. עדכון התשובות במועמד
    const candidate = await CandidateRepo.update(id, { answers, status: 'submitted' });
    
    // 2. כאן תבוא הקריאה לרותי (AI)
    // const analysisResult = await AiService.analyze(answers);
    
    return candidate;
  }
}

module.exports = new CandidateService();