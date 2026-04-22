const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');

// שליפת ניתוח לפי מזהה מועמד
router.get('/:candidateId', analysisController.getCandidateByIdWithAnaysis);

// יצירת ניתוח חדש - ודא שזה השם המדויק בקונטרולר
router.post('/', analysisController.createAnalysis);

module.exports = router;