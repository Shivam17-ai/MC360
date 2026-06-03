const express = require('express');
const router = express.Router();
const controller = require('../controllers/appointment.controller');

router.get('/', controller.getAppointments);

module.exports = router;
