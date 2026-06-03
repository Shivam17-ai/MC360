const mongoose = require('mongoose');

const VideoSessionSchema = new mongoose.Schema({
  participants: Array,
  roomId: String,
}, { timestamps: true });

module.exports = mongoose.model('VideoSession', VideoSessionSchema);
