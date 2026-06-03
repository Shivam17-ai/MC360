const express = require('express');
const router = express.Router();
const controller = require('../controllers/doctor.controller');

router.get('/', controller.getDoctor);

module.exports = router;
