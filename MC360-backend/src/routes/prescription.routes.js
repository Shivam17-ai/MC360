const express = require('express');
const router = express.Router();
const controller = require('../controllers/prescription.controller');

router.get('/', controller.getPrescriptions);

module.exports = router;
