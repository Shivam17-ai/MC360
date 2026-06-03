// MongoDB connection setup
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/mc360';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
};

module.exports = connectDB;
