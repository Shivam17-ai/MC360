const cron = require("node-cron");
const Appointment = require("../models/Appointment.model");
const { createNotification } = require("../services/notification.service");
const { sendAppointmentReminder } = require("../services/whatsapp.service");
const logger = require("../utils/logger");

// Runs every day at 8 AM — sends reminders for tomorrow's appointments
const appointmentReminderJob = cron.schedule("0 8 * * *", async () => {
  logger.info("Running appointment reminder job...");
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const appointments = await Appointment.find({
      date: { $gte: tomorrow, $lt: dayAfter },
      status: "confirmed",
      reminderSent: false,
    })
      .populate({ path: "patient", populate: { path: "user", select: "name phone email notificationPreferences" } })
      .populate({ path: "doctor", populate: { path: "user", select: "name" } });

    logger.info(`Found ${appointments.length} appointment reminders to send`);

    for (const appt of appointments) {
      const patient = appt.patient;
      if (!patient?.user) continue;

      try {
        await createNotification({
          userId: patient.user._id,
          title: "Appointment Tomorrow 📅",
          message: `Reminder: You have an appointment with Dr. ${appt.doctor?.user?.name} tomorrow at ${appt.timeSlot}.`,
          type: "appointment",
          priority: "medium",
          data: { appointmentId: appt._id },
        });

        if (patient.user.notificationPreferences?.whatsapp && patient.user.phone) {
          await sendAppointmentReminder(patient.user.phone, {
            doctorName: appt.doctor?.user?.name || "your doctor",
            date: appt.date.toLocaleDateString(),
            time: appt.timeSlot,
            type: appt.type,
          });
        }

        appt.reminderSent = true;
        await appt.save();
      } catch (err) {
        logger.error(`Appointment reminder failed for ${appt._id}: ${err.message}`);
      }
    }
  } catch (err) {
    logger.error(`Appointment reminder job error: ${err.message}`);
  }
}, { scheduled: false });

module.exports = appointmentReminderJob;