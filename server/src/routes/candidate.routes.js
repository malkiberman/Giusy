const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidate.controller');

router.post('/', candidateController.createCandidate);
router.get('/', candidateController.getAllCandidates);
router.get('/:id', candidateController.getCandidateById); // <-- להוסיף את זה!
module.exports = router;