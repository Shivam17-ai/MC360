/**
 * healthAlert.job.js
 * Cron job — runs every day at 9:00 AM
 * Checks health metrics and sends alerts for abnormal readings
 */

const cron = require("node-cron");
const HealthMetric = require("../models/healthMetric.model");
const { sendNotification } = require("../sockets/notification.socket");
const { createNotification } = require("../utils/notification.util");

// ── Threshold definitions ─────────────────────────────────────
const THRESHOLDS = {
  bloodPressure: {
    systolic:  { min: 90,  max: 140 },
    diastolic: { min: 60,  max: 90  },
  },
  glucose: {
    fasting:    { min: 70,  max: 100 },
    postMeal:   { min: 70,  max: 140 },
  },
  weight: {
    bmiWarning: 30, // BMI >= 30 → obese alert
  },
  heartRate: {
    min: 50,
    max: 100,
  },
  oxygenLevel: {
    min: 95, // SpO2% below this = alert
  },
};

// ── Alert message builders ────────────────────────────────────
const buildAlert = (type, value) => {
  switch (type) {
    case "bloodPressure":
      return {
        title: "⚠️ Abnormal Blood Pressure",
        message: `Your blood pressure reading (${value.systolic}/${value.diastolic} mmHg) is outside the normal range. Please consult your doctor.`,
      };
    case "glucose":
      return {
        title: "⚠️ Abnormal Blood Glucose",
        message: `Your blood glucose level (${value} mg/dL) is outside the normal range. Monitor closely and consult your doctor.`,
      };
    case "heartRate":
      return {
        title: "⚠️ Abnormal Heart Rate",
        message: `Your heart rate (${value} bpm) is outside the normal range (50–100 bpm). Please check with your doctor.`,
      };
    case "oxygenLevel":
      return {
        title: "🚨 Low Oxygen Level",
        message: `Your oxygen saturation (${value}%) is below 95%. Seek medical attention immediately if you feel unwell.`,
      };
    default:
      return null;
  }
};

// ── Core alert checker ────────────────────────────────────────
const checkAndAlert = async (metric) => {
  const { type, value, userId } = metric;
  let shouldAlert = false;
  let alert = null;

  switch (type) {
    case "bloodPressure": {
      const { systolic, diastolic } = value || {};
      const t = THRESHOLDS.bloodPressure;
      if (
        systolic  < t.systolic.min  || systolic  > t.systolic.max ||
        diastolic < t.diastolic.min || diastolic > t.diastolic.max
      ) {
        shouldAlert = true;
        alert = buildAlert("bloodPressure", value);
      }
      break;
    }
    case "glucose": {
      const t = THRESHOLDS.glucose.fasting;
      const numVal = Number(value);
      if (numVal < t.min || numVal > t.max) {
        shouldAlert = true;
        alert = buildAlert("glucose", numVal);
      }
      break;
    }
    case "heartRate": {
      const t = THRESHOLDS.heartRate;
      const numVal = Number(value);
      if (numVal < t.min || numVal > t.max) {
        shouldAlert = true;
        alert = buildAlert("heartRate", numVal);
      }
      break;
    }
    case "oxygenLevel": {
      const numVal = Number(value);
      if (numVal < THRESHOLDS.oxygenLevel.min) {
        shouldAlert = true;
        alert = buildAlert("oxygenLevel", numVal);
      }
      break;
    }
    default:
      break;
  }

  if (shouldAlert && alert) {
    await createNotification({
      userId: userId.toString(),
      title: alert.title,
      message: alert.message,
      type: "health",
    });

    sendNotification(userId.toString(), {
      ...alert,
      type: "health",
    });
  }
};

// ── Main job function ─────────────────────────────────────────
const runHealthAlerts = async () => {
  try {
    // Check metrics logged in the last 24 hours that haven't been alerted
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const metrics = await HealthMetric.find({
      createdAt: { $gte: since },
      alerted: { $ne: true },
    }).populate("userId", "_id");

    if (!metrics.length) {
      console.log("[HealthAlert] No new metrics to check.");
      return;
    }

    console.log(`[HealthAlert] Checking ${metrics.length} metric(s)...`);

    for (const metric of metrics) {
      await checkAndAlert(metric);
      // Mark as alerted so we don't double-notify
      await HealthMetric.findByIdAndUpdate(metric._id, { alerted: true });
    }
  } catch (err) {
    console.error("[HealthAlert] Job failed:", err.message);
  }
};

/**
 * Schedule: every day at 9:00 AM
 */
const scheduleHealthAlerts = () => {
  cron.schedule("0 9 * * *", async () => {
    console.log(`[HealthAlert] Running at ${new Date().toISOString()}`);
    await runHealthAlerts();
  });

  console.log("[HealthAlert] Job scheduled — daily at 9:00 AM");
};

module.exports = { scheduleHealthAlerts, runHealthAlerts };