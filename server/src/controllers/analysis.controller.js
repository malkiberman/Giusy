const AnalysisService = require('../services/analysis.service');


exports.createCandidateAnalysis = async (req, res) => {
  try {
    const { candidateId, answers } = req.body;

    if (!candidateId || !answers) {
      return res.status(400).json({
        message: "candidateId ו-answers הם שדות חובה"
      });
    }

    const analysis = await AnalysisService.analyzeAndCreateConversation(
      candidateId,
      answers
    );

    return res.status(201).json(analysis);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
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