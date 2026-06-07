import Appointment from "../models/Appointment.model.js";
import Doctor from "../models/Doctor.model.js";
import Patient from "../models/Patient.model.js";
import Notification from "../models/Notification.model.js";
import { sendAppointmentReminder } from "../config/twilio.js";

/**
 * Book a new appointment
 */
export const bookAppointment = async ({
  patientId, doctorId, hospitalId, type, date, timeSlot, symptoms, notes,
}) => {
  // Check slot not already taken
  const conflict = await Appointment.findOne({
    doctorId,
    date,
    timeSlot,
    status: { $in: ["pending", "confirmed"] },
  });
  if (conflict) throw new Error("This slot is already booked");

  const appointment = await Appointment.create({
    patientId, doctorId, hospitalId, type,
    date, timeSlot, symptoms, notes,
    status: "pending",
  });

  // Notify doctor
  await Notification.create({
    userId: doctorId,
    type: "appointment",
    title: "New Appointment Request",
    message: `New ${type} appointment on ${date} at ${timeSlot}`,
    relatedId: appointment._id,
  });

  return appointment;
};

/**
 * Get appointments with filters
 */
export const getAppointments = async (userId, role, filters = {}) => {
  const query = {};

  if (role === "patient") query.patientId = userId;
  else if (role === "doctor") query.doctorId = userId;
  else if (role === "hospital_admin") query.hospitalId = filters.hospitalId;

  if (filters.status && filters.status !== "all") query.status = filters.status;
  if (filters.type && filters.type !== "all") query.type = filters.type;
  if (filters.date) query.date = filters.date;

  const appointments = await Appointment.find(query)
    .populate("patientId", "name phone")
    .populate("doctorId", "name specialization")
    .sort({ date: -1, timeSlot: 1 });

  return appointments;
};

/**
 * Get available time slots for a doctor on a date
 */
export const getAvailableSlots = async (doctorId, date) => {
  const allSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "02:00 PM",
    "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
    "04:30 PM", "05:00 PM",
  ];

  const booked = await Appointment.find({
    doctorId,
    date,
    status: { $in: ["pending", "confirmed"] },
  }).select("timeSlot");

  const bookedSlots = booked.map((a) => a.timeSlot);
  return allSlots.filter((s) => !bookedSlots.includes(s));
};

/**
 * Cancel appointment
 */
export const cancelAppointment = async (appointmentId, userId) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new Error("Appointment not found");
  if (appointment.patientId.toString() !== userId.toString()) {
    throw new Error("Not authorized to cancel this appointment");
  }
  if (appointment.status === "completed") {
    throw new Error("Cannot cancel a completed appointment");
  }

  appointment.status = "cancelled";
  await appointment.save();
  return appointment;
};

/**
 * Update appointment status (doctor/admin)
 */
export const updateAppointmentStatus = async (appointmentId, status, notes) => {
  const appointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status, ...(notes && { notes }) },
    { new: true }
  );
  if (!appointment) throw new Error("Appointment not found");
  return appointment;
};