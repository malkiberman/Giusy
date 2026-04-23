const AnalysisService = require('../services/analysis.service');

exports.createAnalysis = async (req, res) => {
  console.log("🔥 REQUEST ID:", Date.now());

  try {
    const { candidateId } = req.body;
    const answers = JSON.parse(req.body.answers || "[]");
    const audioFile = req.file;

    if (!candidateId || !answers) {
      return res.status(400).json({ message: "Missing candidateId or answers" });
    }

    console.log("📥 candidateId:", candidateId);
    console.log("📥 answers:", answers);
    console.log("🎤 audio received:", !!audioFile);

    // 🔥 שליחה לפייתון (חשוב מאוד)
    const result = await AnalysisService.analyzeAndCreateConversation(
      candidateId,
      answers,
      audioFile // 👈 במקום audioKey
    );

    return res.status(201).json(result);

  } catch (error) {
    console.error("❌ Controller Error:", error.message);
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