/**
 * medicineReminder.job.js
 * Cron job — runs every minute to match exact HH:MM timings
 * Sends medicine reminders based on user-set timings
 */

const cron = require("node-cron");
const Medicine = require("../models/medicine.model");
const { sendNotification } = require("../sockets/notification.socket");
const { createNotification } = require("../utils/notification.util");

// ── Match current hour:minute to medicine timings ─────────────
const isTimeMatch = (timings = []) => {
  const now = new Date();
  const currentHour   = now.getHours().toString().padStart(2, "0");
  const currentMinute = now.getMinutes().toString().padStart(2, "0");
  const currentTime   = `${currentHour}:${currentMinute}`;

  return timings.some((t) => t === currentTime);
};

// ── Main job function ─────────────────────────────────────────
const sendMedicineReminders = async () => {
  try {
    // FIX: Normalize today to the start of the day (00:00:00) 
    // to prevent dropping medicines that expire today.
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Only active medicines (not expired / not deleted)
    const medicines = await Medicine.find({
      timings: { $exists: true, $not: { $size: 0 } },
      $or: [
        { endDate: { $gte: startOfToday } },
        { endDate: null },
        { endDate: { $exists: false } },
      ],
    }).populate("userId", "_id name");

    if (!medicines.length) {
      return; // Quiet return to reduce log spam every single minute
    }

    let sent = 0;

    for (const med of medicines) {
      try {
        if (!isTimeMatch(med.timings)) continue;

        const patientId = med.userId?._id?.toString();
        if (!patientId) continue;

        const title   = "💊 Medicine Reminder";
        const message = `Time to take ${med.name} — ${med.dosage}.${
          med.notes ? ` Note: ${med.notes}` : ""
        }`;

        // Send out notifications via DB tracking and real-time sockets
        await createNotification({ userId: patientId, title, message, type: "medicine" });
        sendNotification(patientId, { title, message, type: "medicine" });

        // NOTE: Individual 'isTaken' resetting removed from here. 
        // The specialized resetDailyAdherence job below handles this elegantly at midnight.

        sent++;
      } catch (innerErr) {
        console.error(`[MedicineReminder] Error for medicine ${med._id}:`, innerErr.message);
      }
    }

    if (sent > 0) console.log(`[MedicineReminder] Sent ${sent} reminder(s).`);
  } catch (err) {
    console.error("[MedicineReminder] Job failed:", err.message);
  }
};

// ── Daily reset: mark all medicines as not-taken at midnight ──
const resetDailyAdherence = async () => {
  try {
    const result = await Medicine.updateMany({ isTaken: true }, { isTaken: false });
    console.log(`[MedicineReminder] Daily reset — ${result.modifiedCount} medicine(s) reset.`);
  } catch (err) {
    console.error("[MedicineReminder] Daily reset failed:", err.message);
  }
};

/**
 * Schedules:
 * - Every minute: check timings
 * - Midnight: reset isTaken flag
 */
const scheduleMedicineReminders = () => {
  // Check every minute for matching timings
  cron.schedule("* * * * *", async () => {
    await sendMedicineReminders();
  });

  // Reset adherence at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log(`[MedicineReminder] Midnight reset at ${new Date().toISOString()}`);
    await resetDailyAdherence();
  });

  console.log("[MedicineReminder] Jobs scheduled — every minute + midnight reset");
};

module.exports = { scheduleMedicineReminders, sendMedicineReminders, resetDailyAdherence };