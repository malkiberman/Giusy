const AnalysisService = require('../services/analysis.service');

exports.createAnalysis = async (req, res) => {
  try {
    const { candidateId, answers } = req.body;
    
    if (!candidateId || !answers) {
      return res.status(400).json({ message: "Missing candidateId or answers" });
    }

    console.log("📥 Starting AI Analysis for:", candidateId);
    
    // שליחה ל-Service
    const result = await AnalysisService.analyzeAndCreateConversation(candidateId, answers);
    
    console.log("✅ Analysis complete");
    return res.status(201).json(result);
  } catch (error) {
    console.error("❌ Controller Analysis Error:", error.message);
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
};