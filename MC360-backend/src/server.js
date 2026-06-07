import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import { initSocket } from "./sockets/index.js";

const PORT = env.PORT || 5000;

// ── Create HTTP server ────────────────────────────────────────────────────
const server = http.createServer(app);

// ── Init Socket.IO ────────────────────────────────────────────────────────
initSocket(server);

// ── Connect DB then start server ──────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log("─────────────────────────────────────────");
      console.log(`🚀 MC360 Server running on port ${PORT}`);
      console.log(`📦 Environment : ${env.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${env.FRONTEND_URL}`);
      console.log(`🤖 ML Service  : ${env.ML_SERVICE_URL}`);
      console.log("─────────────────────────────────────────");
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

// ── Unhandled rejections ──────────────────────────────────────────────────
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  server.close(() => process.exit(1));
});

// ── Uncaught exceptions ───────────────────────────────────────────────────
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  process.exit(1);
});

// ── Graceful shutdown ─────────────────────────────────────────────────────
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

startServer();