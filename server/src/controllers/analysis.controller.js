const AnalysisService = require('../services/analysis.service');

exports.getCandidateAnalysis = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const analysis = await AnalysisService.getAnalysisByCandidate(candidateId);
    
    if (!analysis) {
      return res.status(404).json({ message: "לא נמצא ניתוח למועמד זה" });
    }
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};