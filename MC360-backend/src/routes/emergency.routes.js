const express = require('express');
const router = express.Router();
const controller = require('../controllers/emergency.controller');

router.get('/', controller.getEmergencyAlerts);

module.exports = router;
