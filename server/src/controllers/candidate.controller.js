const CandidateService = require('../services/candidate.service');
const AnalysisService = require('../services/analysis.service'); 

exports.createCandidate = async (req, res) => {
  try {
    const result = await CandidateService.registerCandidate(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCandidates = async (req, res) => {
  const candidates = await CandidateService.getAllCandidates();
  res.json(candidates);
};

exports.getCandidateByIdWithAnaysis = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await CandidateService.getCandidateByIdWithAnaysis(id);

    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCandidatesWithSomeAnaysis = async (req, res) => {
  try {
    const candidates = await CandidateService.getAllCandidatesWithSomeAnaysis();
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};