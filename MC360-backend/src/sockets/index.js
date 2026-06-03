const socketIo = require('socket.io');

exports.initializeSockets = (server) => {
  const io = socketIo(server);
  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);
  });
};
