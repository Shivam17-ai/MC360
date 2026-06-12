const { getTwilioClient } = require("../config/twilio");
const env = require("../config/env");
const logger = require("../utils/logger");

const sendWhatsApp = async (to, message) => {
  const client = getTwilioClient();
  if (!client) {
    logger.warn(`WhatsApp not sent (Twilio not configured). To: ${to}`);
    return;
  }

  try {
    const formatted = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
    const result = await client.messages.create({
      body: message,
      from: env.TWILIO_WHATSAPP_FROM,
      to: formatted,
    });
    logger.info(`WhatsApp sent to ${to}: ${result.sid}`);
    return result;
  } catch (err) {
    logger.error(`WhatsApp send error: ${err.message}`);
  }
};

const sendSMS = async (to, message) => {
  const client = getTwilioClient();
  if (!client) {
    logger.warn(`SMS not sent (Twilio not configured). To: ${to}`);
    return;
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: env.TWILIO_PHONE_NUMBER,
      to,
    });
    logger.info(`SMS sent to ${to}: ${result.sid}`);
    return result;
  } catch (err) {
    logger.error(`SMS send error: ${err.message}`);
  }
};

const sendAppointmentReminder = (phone, { doctorName, date, time, type }) =>
  sendWhatsApp(
    phone,
    `🏥 *MC360 Appointment Reminder*\n\nHi! You have an appointment with *Dr. ${doctorName}* on *${date}* at *${time}*.\nType: ${type}\n\nPlease arrive 10 minutes early.`
  );

const sendMedicineReminder = (phone, { medicineName, dosage, timing }) =>
  sendSMS(phone, `MC360 Reminder: Time to take ${medicineName} (${dosage}) — ${timing}`);

module.exports = { sendWhatsApp, sendSMS, sendAppointmentReminder, sendMedicineReminder };