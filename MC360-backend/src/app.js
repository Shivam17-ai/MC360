const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const routes = require("./routes");
const { globalLimiter } = require("./middlewares/rateLimiter.middleware");
const { errorHandler, notFound } = require("./middlewares/error.middleware");
const env = require("./config/env");

const app = express();

// ── Trust proxy (required for Render/Heroku/etc behind load balancers) ────────
// Without this, express-rate-limit throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
// and aborts requests before they reach the route handler.
app.set('trust proxy', 1);

// ── Security ─────────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginOpenerPolicy: false,
  })
);
app.use(mongoSanitize());
app.use(hpp());

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      env.CLIENT_URL,
      "http://localhost:5173",
      "http://localhost:3000",
      "https://mc360.onrender.com",
    ];
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith(".vercel.app") ||
                      /\.vercel\.app$/.test(origin) ||
                      /^http:\/\/localhost:\d+$/.test(origin) ||
                      /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(compression());

// ── Logging ───────────────────────────────────────────────────────────────────
if (env.NODE_ENV !== "test") {
  app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
app.use("/api", globalLimiter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), timestamp: new Date().toISOString(), env: env.NODE_ENV });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/v1", routes);

// ── 404 & Error handlers ──────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;