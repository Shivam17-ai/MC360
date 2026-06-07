/**
 * sockets/index.js
 * Initialises Socket.IO and registers all socket namespaces/handlers
 * Called once from server.js: initSockets(httpServer)
 */

const { Server } = require("socket.io");
const jwt        = require("jsonwebtoken");
const User       = require("../models/user.model");

const { registerNotificationSocket } = require("./notification.socket");
const { registerQueueSocket }        = require("./queue.socket");
const { registerWebRTCSocket }       = require("./webrtc.socket");
const { registerEmergencySocket }    = require("./emergency.socket");

let io; // singleton

const initSockets = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin     : process.env.CLIENT_URL || "http://localhost:5173",
      methods    : ["GET", "POST"],
      credentials: true,
    },
    pingTimeout  : 60000,
    pingInterval : 25000,
  });

  // ── JWT Auth Middleware ──────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) return next(new Error("Authentication error: no token"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user    = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("Authentication error: user not found"));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: " + err.message));
    }
  });

  // ── Connection handler ───────────────────────────────────
  io.on("connection", (socket) => {
    const user = socket.user;
    console.log(`[Socket] Connected: ${socket.id} | user:${user._id} role:${user.role}`);

    // Each user joins their own personal room
    socket.join(user._id.toString());
    // Also join role-based room
    socket.join(user.role);

    // Register feature-specific handlers
    registerNotificationSocket(io, socket);
    registerQueueSocket(io, socket);
    registerWebRTCSocket(io, socket);
    registerEmergencySocket(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`[Socket] Disconnected: ${socket.id} | reason: ${reason}`);
    });

    socket.on("error", (err) => {
      console.error(`[Socket] Error on ${socket.id}:`, err.message);
    });
  });

  console.log("[Socket.IO] Initialised ✅");
  return io;
};

// Getter — use anywhere to emit without passing io around
const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialised. Call initSockets(server) first.");
  return io;
};

module.exports = { initSockets, getIO };