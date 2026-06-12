const cron = require("node-cron");
const Medicine = require("../models/Medicine.model");
const Patient = require("../models/Patient.model");
const { createNotification } = require("../services/notification.service");
const { sendMedicineReminder } = require("../services/whatsapp.service");
const logger = require("../utils/logger");

// Runs every hour at minute 0
const medicineReminderJob = cron.schedule("0 * * * *", async () => {
  logger.info("Running medicine reminder job...");
  try {
    const currentHour = new Date().getHours();
    const currentTime = `${String(currentHour).padStart(2, "0")}:00`;

    const medicines = await Medicine.find({
      isActive: true,
      reminderEnabled: true,
      timings: currentTime,
      $or: [{ endDate: null }, { endDate: { $gte: new Date() } }],
    }).populate({ path: "patient", populate: { path: "user", select: "name phone notificationPreferences" } });

    logger.info(`Found ${medicines.length} medicine reminders to send`);

    for (const medicine of medicines) {
      const patient = medicine.patient;
      if (!patient?.user) continue;

      try {
        await createNotification({
          userId: patient.user._id,
          title: "Medicine Reminder 💊",
          message: `Time to take ${medicine.name} (${medicine.dosage || ""})`,
          type: "medicine",
          priority: "high",
          data: { medicineId: medicine._id },
        });

        if (patient.user.notificationPreferences?.sms && patient.user.phone) {
          await sendMedicineReminder(patient.user.phone, { medicineName: medicine.name, dosage: medicine.dosage, timing: currentTime });
        }
      } catch (err) {
        logger.error(`Medicine reminder failed for ${medicine._id}: ${err.message}`);
      }
    }
  } catch (err) {
    logger.error(`Medicine reminder job error: ${err.message}`);
  }
}, { scheduled: false });

module.exports = medicineReminderJob;