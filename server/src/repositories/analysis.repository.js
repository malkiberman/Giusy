const Analysis = require('../models/analysis.model');

class AnalysisRepository {
  async create(analysisData) {
    return await Analysis.create(analysisData);
  }

  async findByCandidateId(candidateId) {
    return await Analysis.findOne({ candidateId });
  }
}

module.exports = new AnalysisRepository();