const QueueToken = require("../models/QueueToken.model");
const { createNotification } = require("./notification.service");
const logger = require("../utils/logger");

const generateToken = async ({ patientId, doctorId, hospitalId, appointmentId, type = "appointment" }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastToken = await QueueToken.findOne({
    hospital: hospitalId,
    doctor: doctorId,
    date: { $gte: today },
  }).sort({ tokenNumber: -1 });

  const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;
  const prefix = type === "emergency" ? "E" : "A";
  const tokenDisplay = `${prefix}-${String(tokenNumber).padStart(3, "0")}`;

  const token = await QueueToken.create({
    tokenNumber,
    tokenDisplay,
    patient: patientId,
    doctor: doctorId,
    hospital: hospitalId,
    appointment: appointmentId,
    type,
    status: "waiting",
    date: new Date(),
  });

  // Estimate wait time: 15 min per person ahead
  const ahead = await QueueToken.countDocuments({
    hospital: hospitalId,
    doctor: doctorId,
    date: { $gte: today },
    status: "waiting",
    tokenNumber: { $lt: tokenNumber },
  });

  token.estimatedWaitTime = ahead * 15;
  await token.save();

  // Broadcast to queue board
  try {
    const io = require("../sockets").getIO();
    if (io) io.to(`queue_${hospitalId}_${doctorId}`).emit("queue_update", { type: "new_token", token });
  } catch {}

  return token;
};

const callNextToken = async (doctorId, hospitalId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const next = await QueueToken.findOne({
    doctor: doctorId,
    hospital: hospitalId,
    date: { $gte: today },
    status: "waiting",
  })
    .sort({ tokenNumber: 1 })
    .populate({ path: "patient", populate: { path: "user", select: "name" } });

  if (!next) return null;

  next.status = "called";
  next.calledAt = new Date();
  await next.save();

  try {
    const io = require("../sockets").getIO();
    if (io) io.to(`queue_${hospitalId}_${doctorId}`).emit("queue_update", { type: "called", token: next });
  } catch {}

  return next;
};

const getQueueStatus = async (doctorId, hospitalId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tokens = await QueueToken.find({
    doctor: doctorId,
    hospital: hospitalId,
    date: { $gte: today },
    status: { $in: ["waiting", "called", "in-progress"] },
  })
    .sort({ tokenNumber: 1 })
    .populate({ path: "patient", populate: { path: "user", select: "name avatar" } });

  return tokens;
};

const updateTokenStatus = async (tokenId, status) => {
  return QueueToken.findByIdAndUpdate(tokenId, { status }, { new: true });
};

module.exports = { generateToken, callNextToken, getQueueStatus, updateTokenStatus };