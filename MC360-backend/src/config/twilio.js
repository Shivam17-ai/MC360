import twilio from "twilio";
import env from "./env.js";

// ── Twilio client ─────────────────────────────────────────────────────────
const client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

/**
 * Send WhatsApp message via Twilio
 * @param {string} to   - recipient e.g. "whatsapp:+919876543210"
 * @param {string} body - message text
 */
export const sendWhatsApp = async (to, body) => {
  try {
    const message = await client.messages.create({
      from: env.TWILIO_WHATSAPP_FROM,
      to: to.startsWith("whatsapp:") ? to : `whatsapp:${to}`,
      body,
    });
    console.log(`✅ WhatsApp sent to ${to} | SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error(`❌ WhatsApp failed to ${to}:`, error.message);
    throw error;
  }
};

/**
 * Send medicine reminder via WhatsApp
 * @param {string} phone
 * @param {string} medicineName
 * @param {string} dosage
 * @param {string} time
 */
export const sendMedicineReminder = async (phone, medicineName, dosage, time) => {
  const body =
    `💊 *MedConnect360 Reminder*\n\n` +
    `Time to take your medicine!\n\n` +
    `🔹 Medicine: *${medicineName}*\n` +
    `🔹 Dosage: *${dosage}*\n` +
    `🔹 Time: *${time}*\n\n` +
    `Stay healthy! 💙`;
  return await sendWhatsApp(phone, body);
};

/**
 * Send appointment reminder via WhatsApp
 * @param {string} phone
 * @param {string} doctorName
 * @param {string} date
 * @param {string} time
 */
export const sendAppointmentReminder = async (phone, doctorName, date, time) => {
  const body =
    `📅 *MedConnect360 Appointment Reminder*\n\n` +
    `You have an upcoming appointment!\n\n` +
    `🔹 Doctor: *${doctorName}*\n` +
    `🔹 Date: *${date}*\n` +
    `🔹 Time: *${time}*\n\n` +
    `Please be on time. 🏥`;
  return await sendWhatsApp(phone, body);
};

/**
 * Send emergency alert via WhatsApp
 * @param {string} phone
 * @param {string} patientName
 * @param {string} alertMessage
 */
export const sendEmergencyAlert = async (phone, patientName, alertMessage) => {
  const body =
    `🚨 *MedConnect360 Emergency Alert*\n\n` +
    `Patient: *${patientName}*\n\n` +
    `⚠️ ${alertMessage}\n\n` +
    `Please take immediate action!`;
  return await sendWhatsApp(phone, body);
};

export default client;