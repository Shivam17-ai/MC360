const cron = require("node-cron");
const Appointment = require("../models/Appointment.model");
const Patient = require("../models/Patient.model");
const Doctor = require("../models/Doctor.model");
const User = require("../models/User.model");
const { createNotification } = require("../services/notification.service");
const logger = require("../utils/logger");

const checkAndCancelExpiredAppointments = async () => {
  logger.info("Running auto-cancellation job for passed appointments...");
  try {
    const activeAppointments = await Appointment.find({
      status: { $in: ["pending", "confirmed"] }
    }).populate({ path: "patient", populate: { path: "user", select: "_id" } })
      .populate({ path: "doctor", populate: { path: "user", select: "name" } });

    const now = new Date();
    let cancelledCount = 0;

    for (const appt of activeAppointments) {
      try {
        if (!appt.timeSlot) continue;

        const timeParts = appt.timeSlot.split(" - ");
        const endTimePart = timeParts[1] || timeParts[0];
        if (!endTimePart) continue;

        const [hours, minutes] = endTimePart.split(":").map(Number);
        if (isNaN(hours) || isNaN(minutes)) continue;

        const appointmentDate = new Date(appt.date);
        const year = appointmentDate.getUTCFullYear();
        const month = appointmentDate.getUTCMonth();
        const date = appointmentDate.getUTCDate();

        // Use UTC consistently to avoid timezone mismatch
        const endDateTime = new Date(Date.UTC(year, month, date, hours, minutes, 0, 0));

        if (endDateTime < now) {
          appt.status = "completed";
          await appt.save();
          cancelledCount++;

          if (appt.patient && appt.patient.user) {
            await createNotification({
              userId: appt.patient.user._id,
              title: "Appointment Completed ✅",
              message: `Your appointment with Dr. ${appt.doctor?.user?.name || "your doctor"} on ${new Date(appt.date).toLocaleDateString()} at ${appt.timeSlot} has been marked as completed.`,
              type: "appointment",
              priority: "low",
              data: { appointmentId: appt._id }
            });
          }
        }
      } catch (err) {
        logger.error(`Failed to auto-complete appointment ${appt._id}: ${err.message}`);
      }
    }

    if (cancelledCount > 0) {
      logger.info(`Auto-completed ${cancelledCount} past appointments.`);
    }
  } catch (err) {
    logger.error(`Appointment auto-cancellation job error: ${err.message}`);
  }
};

const appointmentCancelJob = cron.schedule("*/15 * * * *", checkAndCancelExpiredAppointments, { scheduled: false });
appointmentCancelJob.task = checkAndCancelExpiredAppointments;

module.exports = appointmentCancelJob;
