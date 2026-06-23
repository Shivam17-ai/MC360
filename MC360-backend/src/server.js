require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");
const { initFirebase } = require("./config/firebase");
const { initCloudinary } = require("./config/cloudinary");
const { initTwilio } = require("./config/twilio");
const { initSockets } = require("./sockets");
const logger = require("./utils/logger");
const env = require("./config/env");

// Background jobs
const medicineReminderJob = require("./jobs/medicineReminder.job");
const appointmentReminderJob = require("./jobs/appointmentReminder.job");
const appointmentCancelJob = require("./jobs/appointmentCancel.job");
const healthAlertJob = require("./jobs/healthAlert.job");

const server = http.createServer(app);

// ── Socket.IO ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: [
      env.CLIENT_URL,
      "http://localhost:5173",
      "http://localhost:3000",
      "https://mc360.onrender.com",
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const startServer = async () => {
  try {
    // Connect database
    await connectDB();

    // Init third-party services (gracefully — they warn if keys missing)
    initFirebase();
    initCloudinary();
    initTwilio();

    // Init Socket.IO
    initSockets(io);

    // Start cron jobs
    medicineReminderJob.start();
    appointmentReminderJob.start();
    appointmentCancelJob.start();
    healthAlertJob.start();
    logger.info("Background jobs started.");

    // Start server
    server.listen(env.PORT, () => {
      logger.info(`🚀 MC360 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`📡 API: http://localhost:${env.PORT}/api/v1`);
      logger.info(`❤️  Health: http://localhost:${env.PORT}/health`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = (signal) => {
  logger.info(`${signal} received. Shutting down...`);
  server.close(async () => {
    logger.info("HTTP server closed.");
    try {
      await require("mongoose").connection.close();
      logger.info("MongoDB connection closed.");
      process.exit(0);
    } catch (err) {
      logger.error(`Error closing MongoDB: ${err.message}`);
      process.exit(1);
    }
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (err) => {
  logger.error(`Unhandled Rejection: ${err.stack || err.message}`);
  shutdown("unhandledRejection");
});

startServer();