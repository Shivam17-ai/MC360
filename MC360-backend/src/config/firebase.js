const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const path = require("path");
const logger = require("../utils/logger");

// Path to the service account JSON (only used in local dev / when the file exists)
const SERVICE_ACCOUNT_PATH = path.resolve(
  __dirname,
  "../../mc360-a4569-firebase-adminsdk-fbsvc-15e1e929aa.json"
);

const initFirebase = () => {
  try {
    if (getApps().length > 0) {
      // Already initialised — return existing app
      return getApps()[0];
    }

    let credential;

    // ── Strategy 1: use the service-account JSON file (local dev) ──────────
    const fs = require("fs");
    if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
      const serviceAccount = JSON.parse(
        fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf8")
      );
      credential = cert(serviceAccount);
      logger.info("Firebase Admin: using service-account JSON file.");
    } else {
      // ── Strategy 2: fall back to individual env vars (production) ─────────
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      // dotenv stores \\n as a literal backslash-n inside double-quoted values;
      // replace both variants to get real newlines.
      const privateKey = process.env.FIREBASE_PRIVATE_KEY
        ?.trim()
        .replace(/\\n/g, "\n");

      if (!projectId || !clientEmail || !privateKey) {
        logger.warn(
          "Firebase credentials missing — Firebase auth disabled."
        );
        return null;
      }

      credential = cert({ projectId, clientEmail, privateKey });
      logger.info("Firebase Admin: using env-var credentials.");
    }

    initializeApp({ credential });
    logger.info("Firebase Admin initialized successfully.");
    return getApps()[0];
  } catch (err) {
    logger.error(`Firebase init error: ${err.message}`);
    return null;
  }
};

/**
 * Returns the firebase-admin Auth instance.
 * Returns null when Firebase is not initialised (missing creds).
 */
const getFirebaseAuth = () => {
  if (getApps().length === 0) {
    // Try to initialise on first use (handles cases where initFirebase
    // was not called before the first request arrives).
    initFirebase();
  }
  if (getApps().length === 0) return null;
  return getAuth();
};

module.exports = { initFirebase, getFirebaseAuth };