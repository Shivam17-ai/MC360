const VideoSession = require("../models/VideoSession.model");
const logger = require("../utils/logger");

module.exports = (socket, io) => {
  // Join a video session room
  socket.on("join_video_room", async ({ sessionId }) => {
    socket.join(`video_${sessionId}`);
    logger.info(`${socket.user._id} joined video room: ${sessionId}`);

    try {
      const update = socket.user.role === "patient"
        ? { patientJoined: true }
        : { doctorJoined: true };
      const session = await VideoSession.findOneAndUpdate({ sessionId }, { ...update, status: "active", startedAt: new Date() }, { new: true });
      if (session) {
        io.to(`video_${sessionId}`).emit("participant_joined", { userId: socket.user._id, role: socket.user.role });
      }
    } catch (err) {
      logger.error(`join_video_room DB error: ${err.message}`);
    }
  });

  // WebRTC signaling relay
  socket.on("webrtc_offer", ({ sessionId, offer }) => {
    socket.to(`video_${sessionId}`).emit("webrtc_offer", { offer, from: socket.user._id });
  });

  socket.on("webrtc_answer", ({ sessionId, answer }) => {
    socket.to(`video_${sessionId}`).emit("webrtc_answer", { answer, from: socket.user._id });
  });

  socket.on("webrtc_ice_candidate", ({ sessionId, candidate }) => {
    socket.to(`video_${sessionId}`).emit("webrtc_ice_candidate", { candidate, from: socket.user._id });
  });

  socket.on("end_video_call", async ({ sessionId }) => {
    try {
      const session = await VideoSession.findOne({ sessionId });
      if (session) {
        const duration = session.startedAt ? Math.floor((Date.now() - session.startedAt) / 1000) : 0;
        await VideoSession.findOneAndUpdate({ sessionId }, { status: "ended", endedAt: new Date(), duration });
      }
      io.to(`video_${sessionId}`).emit("call_ended", { by: socket.user._id });
      socket.leave(`video_${sessionId}`);
    } catch (err) {
      logger.error(`end_video_call error: ${err.message}`);
    }
  });

  socket.on("toggle_mute", ({ sessionId, muted }) => {
    socket.to(`video_${sessionId}`).emit("participant_muted", { userId: socket.user._id, muted });
  });

  socket.on("toggle_camera", ({ sessionId, cameraOff }) => {
    socket.to(`video_${sessionId}`).emit("participant_camera", { userId: socket.user._id, cameraOff });
  });
};