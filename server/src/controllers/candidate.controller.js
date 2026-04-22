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
  try {
    const candidates = await CandidateService.getAllCandidates();
    if (!candidates || candidates.length === 0) {
      return res.status(404).json({ message: "לא נמצאו מועמדים" });
    }
    res.json(candidates); // התגובה צריכה להיות בסוף
  } catch (error) {
    res.status(500).json({ message: error.message });
  }


exports.getCandidateWithAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. שולפים את המועמד
    const candidate = await CandidateService.getCandidateById(id);
    if (!candidate) return res.status(404).json({ message: "מועמד לא נמצא" });

    // 2. שולפים את הניתוח שלו (מהקונטרולר/סרוויס השני בעצם)
    const analysis = await AnalysisService.getAnalysisByCandidate(id);

    // 3. מחזירים אובייקט אחד מאוחד
    res.json({
      ...candidate.toObject(),
      analysis: analysis || null // מחזיר null אם ה-AI עוד לא סיים
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
}