const logger = require("../utils/logger");

module.exports = (socket, io) => {
  // Doctor/Hospital joins a queue room to get live updates
  socket.on("join_queue_room", ({ doctorId, hospitalId }) => {
    const room = `queue_${hospitalId}_${doctorId}`;
    socket.join(room);
    logger.info(`${socket.user._id} joined queue room: ${room}`);
  });

  socket.on("leave_queue_room", ({ doctorId, hospitalId }) => {
    socket.leave(`queue_${hospitalId}_${doctorId}`);
  });

  // Patient joins to watch their position
  socket.on("watch_queue", ({ doctorId, hospitalId }) => {
    socket.join(`queue_watch_${hospitalId}_${doctorId}`);
  });
};