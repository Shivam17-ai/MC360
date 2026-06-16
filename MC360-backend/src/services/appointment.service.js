const Appointment = require("../models/Appointment.model");
const Doctor = require("../models/Doctor.model");
const Patient = require("../models/Patient.model");
const { createNotification } = require("./notification.service");
const { sendAppointmentConfirmation } = require("../utils/sendEmail");
const { sendAppointmentReminder } = require("./whatsapp.service");
const logger = require("../utils/logger");

const bookAppointment = async ({
  patientUserId,
  doctorId,
  hospitalId,
  date,
  timeSlot,
  type,
  reason,
  symptoms,
}) => {
  const [patient, doctor] = await Promise.all([
    Patient.findOne({ user: patientUserId }).populate("user"),
    Doctor.findById(doctorId).populate("user"),
  ]);

  if (!patient) throw Object.assign(new Error("Patient profile not found."), { statusCode: 404 });
  if (!doctor) throw Object.assign(new Error("Doctor not found."), { statusCode: 404 });

  // Check for double-booking
  const existing = await Appointment.findOne({
    doctor: doctorId,
    date: new Date(date),
    timeSlot,
    status: { $nin: ["cancelled", "rescheduled"] },
  });
  if (existing) throw Object.assign(new Error("This time slot is already booked."), { statusCode: 409 });

  const appointment = await Appointment.create({
    patient: patient._id,
    doctor: doctorId,
    hospital: hospitalId || doctor.hospital,
    date: new Date(date),
    timeSlot,
    type: type || "in-person",
    reason,
    symptoms,
    fee: type === "telemedicine" ? doctor.telemedicineFee : doctor.consultationFee,
    status: "confirmed",
  });

  // Notifications (non-blocking)
  try {
    await createNotification({
      userId: patientUserId,
      title: "Appointment Confirmed",
      message: `Your appointment with Dr. ${doctor.user.name} on ${new Date(date).toLocaleDateString()} at ${timeSlot} is confirmed.`,
      type: "appointment",
      data: { appointmentId: appointment._id },
    });

    await sendAppointmentConfirmation(patient.user, appointment);
  } catch (err) {
    logger.warn(`Post-booking notifications failed: ${err.message}`);
  }

  // Populate and return — fall back to unpopulated if populate fails
  try {
    return await appointment.populate([
      { path: "doctor", populate: { path: "user", select: "name email phone avatar" } },
      { path: "patient", populate: { path: "user", select: "name email phone" } },
      { path: "hospital", select: "name address phone" },
    ]);
  } catch (err) {
    logger.warn(`Appointment populate failed: ${err.message}`);
    return appointment;
  }
};

const cancelAppointment = async (appointmentId, userId, reason) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw Object.assign(new Error("Appointment not found."), { statusCode: 404 });

  appointment.status = "cancelled";
  appointment.cancelReason = reason;
  await appointment.save();

  await createNotification({
    userId,
    title: "Appointment Cancelled",
    message: `Your appointment has been cancelled.`,
    type: "appointment",
  });

  return appointment;
};

const rescheduleAppointment = async (appointmentId, { date, timeSlot }) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw Object.assign(new Error("Appointment not found."), { statusCode: 404 });

  appointment.date = new Date(date);
  appointment.timeSlot = timeSlot;
  appointment.status = "confirmed";
  await appointment.save();

  return appointment;
};

const generateSlots = (startTime, endTime, durationMins) => {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let current = startHour * 60 + startMin;
  const end = endHour * 60 + endMin;
  
  while (current < end) {
    const currentHour = Math.floor(current / 60);
    const currentMin = current % 60;
    const nextMinutes = current + durationMins;
    const nextHour = Math.floor(nextMinutes / 60);
    const nextMin = nextMinutes % 60;
    
    slots.push({
      startTime: `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`,
      endTime: `${String(nextHour).padStart(2, '0')}:${String(nextMin).padStart(2, '0')}`
    });
    
    current = nextMinutes;
  }
  return slots;
};

const getDoctorAvailability = async (doctorId, date) => {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) throw Object.assign(new Error("Doctor not found."), { statusCode: 404 });

  // Parse date safely (ISO format: YYYY-MM-DD) using UTC to avoid timezone issues
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day));
  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
  
  console.log(`[SLOTS DEBUG] Date: ${date}, Parsed: Y=${year} M=${month} D=${day}, DayName: ${dayName}, DoctorID: ${doctorId}`);
  console.log(`[SLOTS DEBUG] Doctor availability array:`, doctor.availability?.map(a => ({ day: a.day, isAvailable: a.isAvailable, slotsCount: a.slots?.length })));

  // Create default availability if not set
  let availability = doctor.availability;
  if (!availability || availability.length === 0) {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    availability = days.map(d => ({
      day: d,
      isAvailable: true,
      slots: generateSlots("09:00", "17:00", 30)
    }));
    logger.info(`[SLOTS] Using default 7-day availability for Doctor ${doctorId}`);
  }

  let daySchedule = availability.find((a) => a.day === dayName);

  // If the doctor has a schedule but this specific day is missing, default to available with slots
  if (!daySchedule) {
    logger.info(`[SLOTS] Day ${dayName} not found in doctor schedule, using fallback slots`);
    daySchedule = {
      day: dayName,
      isAvailable: true,
      slots: generateSlots("09:00", "17:00", 30)
    };
  }

  if (!daySchedule.isAvailable) return { available: false, slots: [] };

  // Get booked slots for this date using UTC
  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

  const booked = await Appointment.find({
    doctor: doctorId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: { $nin: ["cancelled", "rescheduled"] },
  }).select("timeSlot");

  const bookedSlots = booked.map((a) => a.timeSlot);

  const now = new Date();
  const isToday = dateObj.getUTCFullYear() === now.getFullYear() &&
    dateObj.getUTCMonth() === now.getMonth() &&
    dateObj.getUTCDate() === now.getDate();

  const slots = (daySchedule.slots || []).map((slot) => {
    const isBooked = bookedSlots.includes(`${slot.startTime} - ${slot.endTime}`);
    let isPast = false;

    if (isToday) {
      const [hour, minute] = slot.startTime.split(':').map(Number);
      const slotTime = new Date();
      slotTime.setHours(hour, minute, 0, 0);
      if (slotTime < now) isPast = true;
    }

    return {
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: isBooked || isPast,
    };
  });

  return { available: true, day: dayName, slots };
};

module.exports = { bookAppointment, cancelAppointment, rescheduleAppointment, getDoctorAvailability, generateSlots };