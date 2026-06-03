const express = require('express');
const router = express.Router();
const controller = require('../controllers/diet.controller');

router.get('/', controller.getDietPlans);

module.exports = router;
