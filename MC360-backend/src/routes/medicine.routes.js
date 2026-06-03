const express = require('express');
const router = express.Router();
const controller = require('../controllers/medicine.controller');

router.get('/', controller.getMedicines);

module.exports = router;
