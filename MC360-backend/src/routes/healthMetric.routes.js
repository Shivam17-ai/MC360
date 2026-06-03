const express = require('express');
const router = express.Router();
const controller = require('../controllers/healthMetric.controller');

router.get('/', controller.getHealthMetrics);

module.exports = router;
