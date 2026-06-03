const express = require('express');
const router = express.Router();
const controller = require('../controllers/ai.controller');

router.post('/', controller.runAI);

module.exports = router;
