const CandidateService = require('../services/candidate.service');

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
  
  
  if (!candidates) {
      return res.status(404).json({ message: "לא נמצאו מועמדים" });
    }

};