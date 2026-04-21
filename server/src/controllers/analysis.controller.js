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
}; // <-- כאן הייתה חסרה הסגירה!

exports.createAnalysis = async (req, res) => {
  try {
    const { candidateId, answers } = req.body;
    const aiResults = { 
      score: 0, 
      feedback: "הראיון הושלם בהצלחה",
      answers 
    };
    
    const analysis = await AnalysisService.createAnalysis(candidateId, aiResults);
    res.status(201).json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};