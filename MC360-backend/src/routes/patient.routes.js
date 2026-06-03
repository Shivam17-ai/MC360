const express = require('express');
const router = express.Router();
const controller = require('../controllers/patient.controller');

router.get('/', controller.getPatient);

module.exports = router;
