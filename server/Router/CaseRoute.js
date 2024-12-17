const express = require('express');
const router = express.Router();
const caseController = require('../Controllers/CaseController');

router.get('/getCaseById', caseController.getCaseById);

module.exports = router;