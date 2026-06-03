const express = require('express');
const router = express.Router();
const controller = require('../controllers/hospital.controller');

router.get('/', controller.getHospital);

module.exports = router;
