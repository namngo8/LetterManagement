const express = require('express');
const router = express.Router();
const provinceController = require('../Controllers/ProvinceController');

router.get('/getProvince', provinceController.getProvince);

module.exports = router;