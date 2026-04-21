const Candidate = require('../models/candidate.model');

class CandidateRepository {
  async create(data) {
    return await Candidate.create(data);
  }

  async findAllWithAnalysis() {
    return await Candidate.find().populate('analysis');
  }

  async findById(id) {
    return await Candidate.findById(id).populate('analysis');
  }

  async update(id, data) {
    return await Candidate.findByIdAndUpdate(id, data, { new: true });
  }

    async findAll() {
    return await Candidate.find();
    }
}

module.exports = new CandidateRepository();