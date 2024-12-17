const express = require('express');
const router = express.Router();
const agencyController = require('../Controllers/AgencyController');

router.get('/getAgencies', agencyController.getAgencies);

module.exports = router;