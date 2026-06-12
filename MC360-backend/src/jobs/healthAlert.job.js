const cron = require("node-cron");
const HealthMetric = require("../models/HealthMetric.model");
const { createNotification } = require("../services/notification.service");
const logger = require("../utils/logger");

// Runs every day at 9 AM — checks for abnormal readings in last 24h
const healthAlertJob = cron.schedule("0 9 * * *", async () => {
  logger.info("Running health alert job...");
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const abnormalMetrics = await HealthMetric.find({
      isAbnormal: true,
      recordedAt: { $gte: yesterday },
    }).populate({ path: "patient", populate: { path: "user", select: "_id name" } });

    const grouped = {};
    for (const metric of abnormalMetrics) {
      const uid = metric.patient?.user?._id?.toString();
      if (!uid) continue;
      if (!grouped[uid]) grouped[uid] = { user: metric.patient.user, metrics: [] };
      grouped[uid].metrics.push(metric.type.replace(/_/g, " "));
    }

    for (const uid of Object.keys(grouped)) {
      const { user, metrics } = grouped[uid];
      const unique = [...new Set(metrics)].join(", ");
      await createNotification({
        userId: user._id,
        title: "⚠️ Abnormal Health Readings Detected",
        message: `You have abnormal readings for: ${unique}. Please consult your doctor.`,
        type: "health_alert",
        priority: "high",
      });
    }

    logger.info(`Health alerts sent to ${Object.keys(grouped).length} patients`);
  } catch (err) {
    logger.error(`Health alert job error: ${err.message}`);
  }
}, { scheduled: false });

module.exports = healthAlertJob;