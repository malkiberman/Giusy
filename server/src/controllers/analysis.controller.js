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

    if (!candidateId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Missing candidateId or answers array" });
    }

    // חילוץ רק של טקסט התשובות אם נשלח אובייקט מורכב מהפרונט
    const plainAnswers = answers.map(a => typeof a === 'object' ? a.answer : a);

    console.log(`Starting AI Analysis for candidate: ${candidateId}`);
    
    const analysis = await AnalysisService.analyzeAndCreateConversation(
      candidateId, 
      plainAnswers
    );

    return res.status(201).json(analysis);
  } catch (error) {
    console.error("Analysis Controller Error:", error.message);
    return res.status(500).json({ 
      message: "הניתוח נכשל", 
      error: error.message 
    });
  }
};