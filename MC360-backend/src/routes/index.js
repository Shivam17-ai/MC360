const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth.routes'));
router.use('/patients', require('./patient.routes'));
router.use('/doctors', require('./doctor.routes'));
router.use('/hospitals', require('./hospital.routes'));
router.use('/appointments', require('./appointment.routes'));
router.use('/tests', require('./test.routes'));
router.use('/reports', require('./report.routes'));
router.use('/prescriptions', require('./prescription.routes'));
router.use('/medicines', require('./medicine.routes'));
router.use('/health-metrics', require('./healthMetric.routes'));
router.use('/ai', require('./ai.routes'));
router.use('/notifications', require('./notification.routes'));
router.use('/queue', require('./queue.routes'));
router.use('/diet', require('./diet.routes'));
router.use('/emergency', require('./emergency.routes'));
router.use('/analytics', require('./analytics.routes'));

module.exports = router;
