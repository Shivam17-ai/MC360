import QueueToken from "../models/QueueToken.model.js";
import Appointment from "../models/Appointment.model.js";

/**
 * Generate queue token for an appointment
 */
export const generateQueueToken = async (appointmentId, doctorId) => {
  // Check existing token
  const existing = await QueueToken.findOne({
    appointmentId,
    status: { $in: ["waiting", "called"] },
  });
  if (existing) return existing;

  // Get last token number for this doctor today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastToken = await QueueToken.findOne({
    doctorId,
    createdAt: { $gte: today },
  }).sort({ tokenNumber: -1 });

  const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

  // Estimate wait time (15 mins per patient ahead)
  const waitingCount = await QueueToken.countDocuments({
    doctorId,
    status: "waiting",
    createdAt: { $gte: today },
  });
  const estimatedWaitTime = waitingCount * 15;

  const token = await QueueToken.create({
    appointmentId,
    doctorId,
    tokenNumber,
    estimatedWaitTime,
    status: "waiting",
  });

  return token;
};

/**
 * Get live queue for a doctor
 */
export const getLiveQueue = async (doctorId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const queue = await QueueToken.find({
    doctorId,
    status: { $in: ["waiting", "called"] },
    createdAt: { $gte: today },
  })
    .populate({
      path: "appointmentId",
      populate: { path: "patientId", select: "name phone" },
    })
    .sort({ tokenNumber: 1 });

  return queue;
};

/**
 * Update token status
 */
export const updateTokenStatus = async (tokenId, status) => {
  const token = await QueueToken.findByIdAndUpdate(
    tokenId,
    { status },
    { new: true }
  );
  if (!token) throw new Error("Token not found");
  return token;
};

/**
 * Get patient's current token
 */
export const getPatientToken = async (patientId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const appointment = await Appointment.findOne({
    patientId,
    date: new Date().toISOString().split("T")[0],
    status: "confirmed",
  });

  if (!appointment) return null;

  return await QueueToken.findOne({
    appointmentId: appointment._id,
    status: { $in: ["waiting", "called"] },
  });
};