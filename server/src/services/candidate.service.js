const CandidateRepo = require('../repositories/candidate.repository');

class CandidateService {
  async registerCandidate(data) {
    return await CandidateRepo.create(data);
  }

  // הפונקציה שהייתה חסרה וגרמה ל-500:
  async getCandidateById(id) {
    return await CandidateRepo.findById(id);
  }

  async processAnswers(id, answers) {
    const candidate = await CandidateRepo.update(id, { answers, status: 'submitted' });
    return candidate;
  }

  async getAllCandidates() {
    return await CandidateRepo.findAllWithAnalysis();
  }

  async getAllCandidatesWithSomeAnaysis() {
    return await CandidateRepo.getAllCandidatesWithSomeAnaysis();
  }

  async getCandidateByIdWithAnaysis(id) {
  return await CandidateRepo.getCandidateByIdWithAnaysis(id);
}
}
module.exports = new CandidateService();