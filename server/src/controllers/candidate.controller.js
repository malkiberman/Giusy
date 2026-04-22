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
}; // ודאי שיש כאן סגירה!

exports.getCandidateWithAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. שולפים את המועמד
    const candidate = await CandidateService.getCandidateById(id);
    if (!candidate) return res.status(404).json({ message: "מועמד לא נמצא" });

    // 2. שולפים את הניתוח שלו
    const analysis = await AnalysisService.getAnalysisByCandidate(id);

    // 3. מחזירים אובייקט מאוחד
    // שימי לב: אם candidate הוא מסמך Mongoose, משתמשים ב-toObject()
    const candidateData = candidate.toObject ? candidate.toObject() : candidate;

    res.json({
      ...candidateData,
      analysis: analysis || null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};