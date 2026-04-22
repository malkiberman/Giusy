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

// src/controllers/analysis.controller.js
exports.createAnalysis = async (req, res) => {
  try {
    const { candidateId, answers } = req.body;
    console.log("📥 Received analysis request for candidate:", candidateId);

    // הגבלת זמן לניתוח - אם לוקח יותר מ-15 שניות, נעצור
    const analysisPromise = AnalysisService.analyzeAndCreateConversation(candidateId, answers);
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("AI_TIMEOUT")), 15000)
    );

    const result = await Promise.race([analysisPromise, timeoutPromise]);
    
    console.log("✅ Analysis completed and saved");
    return res.status(201).json(result);

  } catch (error) {
    console.error("❌ Analysis Error:", error.message);
    
    // אם ה-AI נתקע, עדיין נחזיר 201 עם הודעת "בניתוח" כדי שהפרונט ימשיך
    if (error.message === "AI_TIMEOUT") {
      return res.status(201).json({ status: "pending", message: "הראיון נשמר, הניתוח יושלם ברקע" });
    }
    
    return res.status(500).json({ message: "שגיאה פנימית בשמירה" });
  }
};