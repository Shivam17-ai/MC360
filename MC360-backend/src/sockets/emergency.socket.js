const logger = require("../utils/logger");

module.exports = (socket, io) => {
  // Hospital/Admin joins emergency monitor room
  socket.on("join_emergency_room", ({ hospitalId }) => {
    if (["hospital", "admin", "doctor"].includes(socket.user.role)) {
      socket.join(`emergency_${hospitalId}`);
      logger.info(`${socket.user._id} joined emergency room for hospital: ${hospitalId}`);
    }
  });

  // Broadcast location update during emergency
  socket.on("emergency_location_update", ({ alertId, location }) => {
    io.emit("emergency_location", { alertId, location, userId: socket.user._id });
  });

  socket.on("leave_emergency_room", ({ hospitalId }) => {
    socket.leave(`emergency_${hospitalId}`);
  });
};