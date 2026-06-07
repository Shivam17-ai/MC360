/**
 * emergency.socket.js
 * Real-time emergency alert broadcasting
 * Compatible with: EmergencyMonitor.jsx (hospital page) + EmergencyAlertBanner.jsx
 */

const Emergency = require("../models/emergency.model");
const { getIO }  = require("./index");

// ── Broadcast emergency to all hospital staff ─────────────────
const broadcastEmergency = (alert) => {
  try {
    const io = getIO();
    // Broadcast to all connected hospital-role users
    io.to("hospital").emit("emergency-alert", alert);
    // Also broadcast to all doctors
    io.to("doctor").emit("emergency-alert", alert);
    console.log(`[EmergencySocket] Alert broadcast: ${alert._id || "new"}`);
  } catch (err) {
    console.error("[EmergencySocket] broadcastEmergency error:", err.message);
  }
};

// ── Broadcast status update (respond / resolve) ───────────────
const broadcastEmergencyUpdate = (alert) => {
  try {
    const io = getIO();
    io.to("hospital").emit("emergency-updated", alert);
    io.to("doctor").emit("emergency-updated", alert);
  } catch (err) {
    console.error("[EmergencySocket] broadcastEmergencyUpdate error:", err.message);
  }
};

// ── Socket event handlers ─────────────────────────────────────
const registerEmergencySocket = (io, socket) => {
  const user = socket.user;

  // ── Patient: trigger emergency SOS ──────────────────────
  socket.on("sos", async ({ location, description, type }) => {
    try {
      const alert = await Emergency.create({
        patientId  : user._id,
        location   : location || "Unknown",
        description: description || "SOS triggered",
        type       : type || "SOS",
        severity   : "critical",
        status     : "active",
      });

      const populated = await alert.populate("patientId", "name phone");

      // Broadcast to hospital and doctors
      broadcastEmergency(populated);

      // Confirm to patient
      socket.emit("sos-confirmed", {
        message   : "Emergency alert sent. Help is on the way.",
        alertId   : alert._id,
      });

      console.log(`[EmergencySocket] SOS from patient: ${user._id}`);
    } catch (err) {
      console.error("[EmergencySocket] SOS error:", err.message);
      socket.emit("sos-error", { message: "Failed to send SOS." });
    }
  });

  // ── Hospital/Doctor: respond to emergency ───────────────
  socket.on("emergency-respond", async ({ alertId }) => {
    try {
      if (!["hospital", "doctor"].includes(user.role)) return;

      const alert = await Emergency.findByIdAndUpdate(
        alertId,
        { status: "responding", respondedBy: user._id, respondedAt: new Date() },
        { new: true }
      ).populate("patientId", "name phone _id");

      if (!alert) {
        socket.emit("emergency-error", { message: "Alert not found." });
        return;
      }

      broadcastEmergencyUpdate(alert);

      // Notify the patient that help is responding
      io.to(alert.patientId?._id?.toString()).emit("emergency-status", {
        message: `Help is on the way. Dr./Staff: ${user.name}`,
        status : "responding",
      });
    } catch (err) {
      console.error("[EmergencySocket] emergency-respond error:", err.message);
    }
  });

  // ── Hospital/Doctor: resolve emergency ───────────────────
  socket.on("emergency-resolve", async ({ alertId }) => {
    try {
      if (!["hospital", "doctor"].includes(user.role)) return;

      const alert = await Emergency.findByIdAndUpdate(
        alertId,
        { status: "resolved", resolvedBy: user._id, resolvedAt: new Date() },
        { new: true }
      ).populate("patientId", "name _id");

      if (!alert) return;

      broadcastEmergencyUpdate(alert);

      io.to(alert.patientId?._id?.toString()).emit("emergency-status", {
        message: "Your emergency has been resolved.",
        status : "resolved",
      });

      console.log(`[EmergencySocket] Resolved emergency: ${alertId}`);
    } catch (err) {
      console.error("[EmergencySocket] emergency-resolve error:", err.message);
    }
  });

  // ── Subscribe to emergency room (hospital only) ──────────
  socket.on("join-emergency-room", () => {
    if (!["hospital", "doctor"].includes(user.role)) return;
    socket.join("emergency-monitor");
    console.log(`[EmergencySocket] ${user.role}:${user._id} joined emergency-monitor`);
  });
};

module.exports = {
  registerEmergencySocket,
  broadcastEmergency,
  broadcastEmergencyUpdate,
};