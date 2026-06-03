const express = require('express');
const router = express.Router();
const controller = require('../controllers/test.controller');

router.get('/', controller.getTests);

module.exports = router;
