const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');
const candidateController = require('../controllers/candidate.controller');

// שליפת ניתוח לפי מזהה מועמד
router.get('/:candidateId', candidateController.getCandidateByIdWithAnaysis);

// יצירת ניתוח חדש - ודא שזה השם המדויק בקונטרולר
router.post('/', analysisController.createAnalysis);

module.exports = router;