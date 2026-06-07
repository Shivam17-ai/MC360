/**
 * queue.socket.js
 * Real-time queue management for doctor waiting rooms
 * Compatible with: useQueue.js hook (frontend)
 */

const Queue = require("../models/queue.model");

const registerQueueSocket = (io, socket) => {
  // ── Patient: join a doctor's queue room ─────────────────
  socket.on("join-queue-room", (doctorId) => {
    if (!doctorId) return;
    socket.join(`queue:${doctorId}`);
    console.log(`[QueueSocket] ${socket.user._id} joined queue room: queue:${doctorId}`);
  });

  // ── Patient: leave a doctor's queue room ────────────────
  socket.on("leave-queue-room", (doctorId) => {
    if (!doctorId) return;
    socket.leave(`queue:${doctorId}`);
  });

  // ── Doctor: advance queue (call next patient) ────────────
  socket.on("advance-queue", async ({ doctorId }) => {
    try {
      if (!doctorId) return;

      const queue = await Queue.findOne({ doctorId })
        .populate("tokens.patientId", "name _id");

      if (!queue || !queue.tokens.length) {
        socket.emit("queue-error", { message: "No patients in queue." });
        return;
      }

      // Find first waiting token
      const nextToken = queue.tokens.find((t) => t.status === "waiting");
      if (!nextToken) {
        socket.emit("queue-error", { message: "No waiting patients." });
        return;
      }

      nextToken.status = "called";
      await queue.save();

      // Notify the specific patient
      const patientId = nextToken.patientId?._id?.toString();
      if (patientId) {
        io.to(patientId).emit("token-called", {
          tokenNumber: nextToken.tokenNumber,
          message    : "It's your turn! Please proceed to the doctor's room.",
        });
      }

      // Broadcast updated queue to all in the room
      const updatedQueue = await Queue.findOne({ doctorId })
        .populate("tokens.patientId", "name _id");

      io.to(`queue:${doctorId}`).emit("queue-updated", updatedQueue?.tokens || []);
    } catch (err) {
      console.error("[QueueSocket] advance-queue error:", err.message);
      socket.emit("queue-error", { message: "Failed to advance queue." });
    }
  });

  // ── Broadcast queue update (called after REST API join/leave) ──
  socket.on("broadcast-queue-update", async ({ doctorId }) => {
    try {
      if (!doctorId) return;
      const queue = await Queue.findOne({ doctorId })
        .populate("tokens.patientId", "name _id");
      io.to(`queue:${doctorId}`).emit("queue-updated", queue?.tokens || []);
    } catch (err) {
      console.error("[QueueSocket] broadcast-queue-update error:", err.message);
    }
  });

  // ── Doctor: reset entire queue ───────────────────────────
  socket.on("reset-queue", async ({ doctorId }) => {
    try {
      if (!doctorId) return;
      await Queue.findOneAndUpdate({ doctorId }, { tokens: [] });
      io.to(`queue:${doctorId}`).emit("queue-updated", []);
      console.log(`[QueueSocket] Queue reset for doctor: ${doctorId}`);
    } catch (err) {
      console.error("[QueueSocket] reset-queue error:", err.message);
    }
  });
};

module.exports = { registerQueueSocket };