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
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; // <--- כאן הייתה חסרה הסגירה שגרמה לקריסה!

exports.getCandidateWithAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. שליפת מועמד
    const candidate = await CandidateService.getCandidateById(id);
    if (!candidate) return res.status(404).json({ message: "מועמד לא נמצא" });

    // 2. שליפת ניתוח
    const analysis = await AnalysisService.getAnalysisByCandidate(id);

    // 3. איחוד נתונים
    const candidateData = candidate.toObject ? candidate.toObject() : candidate;

    res.json({
      ...candidateData,
      analysis: analysis || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};