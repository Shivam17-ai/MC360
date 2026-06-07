/**
 * appointmentReminder.job.js
 * Cron job — runs every day at 8:00 AM
 * Sends reminders for appointments scheduled for tomorrow
 */

const cron = require("node-cron");
const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");
const { sendNotification } = require("../sockets/notification.socket");
const { createNotification } = require("../utils/notification.util");

// Helper: get tomorrow's date range (midnight → 11:59 PM)
const getTomorrowRange = () => {
  const start = new Date();
  start.setDate(start.getDate() + 1);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const sendAppointmentReminders = async () => {
  try {
    const { start, end } = getTomorrowRange();

    const appointments = await Appointment.find({
      date: { $gte: start, $lte: end },
      status: { $in: ["confirmed", "pending"] },
    })
      .populate("patient", "name email _id")
      .populate("doctor", "name _id");

    if (!appointments.length) {
      console.log("[AppointmentReminder] No appointments tomorrow.");
      return;
    }

    console.log(`[AppointmentReminder] Sending ${appointments.length} reminder(s)...`);

    for (const appt of appointments) {
      try {
        const timeStr = appt.timeSlot || appt.time || "your scheduled time";
        const doctorName = appt.doctor?.name || "your doctor";
        const patientId = appt.patient?._id?.toString();

        if (!patientId) continue;

        // Save to DB
        await createNotification({
          userId: patientId,
          title: "Appointment Reminder",
          message: `You have an appointment with Dr. ${doctorName} tomorrow at ${timeStr}.`,
          type: "appointment",
        });

        // Real-time push
        sendNotification(patientId, {
          title: "Appointment Reminder",
          message: `You have an appointment with Dr. ${doctorName} tomorrow at ${timeStr}.`,
          type: "appointment",
        });

        console.log(`[AppointmentReminder] Reminded patient: ${appt.patient?.name}`);
      } catch (innerErr) {
        console.error(`[AppointmentReminder] Error for appointment ${appt._id}:`, innerErr.message);
      }
    }
  } catch (err) {
    console.error("[AppointmentReminder] Job failed:", err.message);
  }
};

/**
 * Schedule: every day at 8:00 AM
 * Change cron expression to test: "* * * * *" = every minute
 */
const scheduleAppointmentReminders = () => {
  cron.schedule("0 8 * * *", async () => {
    console.log(`[AppointmentReminder] Running at ${new Date().toISOString()}`);
    await sendAppointmentReminders();
  });

  console.log("[AppointmentReminder] Job scheduled — daily at 8:00 AM");
};

module.exports = { scheduleAppointmentReminders, sendAppointmentReminders };