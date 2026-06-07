import { sendMedicineReminder, sendAppointmentReminder, sendEmergencyAlert } from "../config/twilio.js";
import Medicine from "../models/Medicine.model.js";
import Appointment from "../models/Appointment.model.js";
import Patient from "../models/Patient.model.js";

/**
 * Send medicine reminder to patient
 */
export const triggerMedicineReminder = async (medicineId) => {
  const medicine = await Medicine.findById(medicineId).populate("patientId");
  if (!medicine) throw new Error("Medicine not found");

  const patient = await Patient.findOne({ userId: medicine.patientId });
  if (!patient?.whatsappNumber) throw new Error("Patient WhatsApp number not set");

  await sendMedicineReminder(
    patient.whatsappNumber,
    medicine.name,
    medicine.dosage,
    new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  );

  return { message: "Medicine reminder sent" };
};

/**
 * Send appointment reminder to patient
 */
export const triggerAppointmentReminder = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate("patientId")
    .populate("doctorId", "name");

  if (!appointment) throw new Error("Appointment not found");

  const patient = await Patient.findOne({ userId: appointment.patientId });
  if (!patient?.whatsappNumber) throw new Error("Patient WhatsApp number not set");

  await sendAppointmentReminder(
    patient.whatsappNumber,
    `Dr. ${appointment.doctorId.name}`,
    appointment.date,
    appointment.timeSlot
  );

  return { message: "Appointment reminder sent" };
};

/**
 * Send emergency alert to emergency contact
 */
export const triggerEmergencyWhatsApp = async (patientId, alertMessage) => {
  const patient = await Patient.findOne({ userId: patientId });
  if (!patient) throw new Error("Patient not found");

  const contactNumber = patient.emergencyContact?.phone;
  if (!contactNumber) throw new Error("No emergency contact set");

  await sendEmergencyAlert(contactNumber, patient.name, alertMessage);
  return { message: "Emergency alert sent" };
};