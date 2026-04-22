const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysis.controller');

// שליפת ניתוח לפי מזהה מועמד
router.get('/:candidateId', analysisController.getCandidateAnalysis);
router.post('/', analysisController.createCandidateAnalysis);

router.post('/', analysisController.createAnalysis);

module.exports = router;