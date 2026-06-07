/**
 * webrtc.socket.js
 * WebRTC signaling server for video consultations
 * Compatible with: useWebRTC.js hook (frontend)
 *
 * Flow:
 *   1. Caller  → call-offer  → Callee
 *   2. Callee  → call-answer → Caller
 *   3. Both    ↔ ice-candidate exchange
 *   4. Either  → end-call   → Other
 */

const registerWebRTCSocket = (io, socket) => {
  const userId = socket.user._id.toString();

  // ── Join a specific call room ────────────────────────────
  socket.on("join-call-room", ({ roomId }) => {
    if (!roomId) return;
    socket.join(`call:${roomId}`);
    console.log(`[WebRTCSocket] ${userId} joined call room: call:${roomId}`);

    // Notify others in the room that someone joined
    socket.to(`call:${roomId}`).emit("peer-joined", {
      userId,
      name: socket.user.name,
      role: socket.user.role,
    });
  });

  // ── Leave a call room ────────────────────────────────────
  socket.on("leave-call-room", ({ roomId }) => {
    if (!roomId) return;
    socket.leave(`call:${roomId}`);
    socket.to(`call:${roomId}`).emit("peer-left", { userId });
  });

  // ── Caller sends offer ───────────────────────────────────
  socket.on("call-offer", ({ roomId, offer }) => {
    if (!roomId || !offer) return;
    socket.to(`call:${roomId}`).emit("call-offer", {
      offer,
      from    : userId,
      fromName: socket.user.name,
    });
    console.log(`[WebRTCSocket] Offer sent in room: call:${roomId}`);
  });

  // ── Callee sends answer ──────────────────────────────────
  socket.on("call-answer", ({ roomId, answer }) => {
    if (!roomId || !answer) return;
    socket.to(`call:${roomId}`).emit("call-answer", { answer, from: userId });
    console.log(`[WebRTCSocket] Answer sent in room: call:${roomId}`);
  });

  // ── ICE candidate exchange ───────────────────────────────
  socket.on("ice-candidate", ({ roomId, candidate }) => {
    if (!roomId || !candidate) return;
    socket.to(`call:${roomId}`).emit("ice-candidate", { candidate, from: userId });
  });

  // ── End call ─────────────────────────────────────────────
  socket.on("end-call", ({ roomId }) => {
    if (!roomId) return;
    socket.to(`call:${roomId}`).emit("call-ended", { from: userId });
    socket.leave(`call:${roomId}`);
    console.log(`[WebRTCSocket] Call ended in room: call:${roomId}`);
  });

  // ── Screen share toggle notification ────────────────────
  socket.on("screen-share-started", ({ roomId }) => {
    socket.to(`call:${roomId}`).emit("screen-share-started", { from: userId });
  });

  socket.on("screen-share-stopped", ({ roomId }) => {
    socket.to(`call:${roomId}`).emit("screen-share-stopped", { from: userId });
  });

  // ── Media state (mute/video toggle) ─────────────────────
  socket.on("media-state", ({ roomId, isMuted, isVideoOff }) => {
    socket.to(`call:${roomId}`).emit("peer-media-state", {
      from: userId,
      isMuted,
      isVideoOff,
    });
  });

  // ── Cleanup on disconnect ────────────────────────────────
  socket.on("disconnect", () => {
    // Notify all call rooms this socket was in
    socket.rooms.forEach((room) => {
      if (room.startsWith("call:")) {
        socket.to(room).emit("call-ended", { from: userId, reason: "disconnected" });
      }
    });
  });
};

module.exports = { registerWebRTCSocket };