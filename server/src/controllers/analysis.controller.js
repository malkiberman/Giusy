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
    // ... הקוד הקיים שלך לשליפת ניתוח ...
};