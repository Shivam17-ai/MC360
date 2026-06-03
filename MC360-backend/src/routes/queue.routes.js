const express = require('express');
const router = express.Router();
const controller = require('../controllers/queue.controller');

router.get('/', controller.getQueue);

module.exports = router;
