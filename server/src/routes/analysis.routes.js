const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');
const candidateController = require('../controllers/candidate.controller');
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });

// יצירת ניתוח חדש - ודא שזה השם המדויק בקונטרולר

router.post(
  "/",
  upload.single("audio"),
  analysisController.createAnalysis
);
// שליפת ניתוח לפי מזהה מועמד
router.get('/:candidateId', candidateController.getCandidateByIdWithAnaysis);


module.exports = router;