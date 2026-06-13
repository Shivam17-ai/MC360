const { verifyAccessToken } = require("../utils/generateToken");
const User = require("../models/User.model");
const logger = require("../utils/logger");

let io = null;

const initSockets = (socketIO) => {
  io = socketIO;

  // Auth middleware for sockets
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (err) {
      // Try Firebase token
      try {
        const { getAdmin } = require("../config/firebase");
        const admin = getAdmin();
        if (!admin) return next(new Error("Auth failed"));
        const decoded = await admin.auth().verifyIdToken(socket.handshake.auth?.token);
        const user = await User.findOne({ firebaseUid: decoded.uid });
        if (!user) return next(new Error("User not found"));
        socket.user = user;
        next();
      } catch {
        next(new Error("Invalid token"));
      }
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();
    logger.info(`Socket connected: ${userId} (${socket.user.role})`);

    // Join personal room
    socket.join(`user_${userId}`);

    // Register role-specific socket handlers
    require("./queue.socket")(socket, io);
    require("./notification.socket")(socket, io);
    require("./webrtc.socket")(socket, io);
    require("./emergency.socket")(socket, io);

    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${userId}`);
    });
  });

  return io;
};

const getIO = () => io;

module.exports = { initSockets, getIO };