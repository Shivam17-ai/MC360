const admin = require("firebase-admin");
const env = require("./env");
const logger = require("../utils/logger");

let firebaseApp = null;

const initFirebase = () => {
  try {
    // Check required Firebase credentials
    if (
      !env.FIREBASE_PROJECT_ID ||
      !env.FIREBASE_PRIVATE_KEY ||
      !env.FIREBASE_CLIENT_EMAIL
    ) {
      logger.warn(
        "Firebase credentials missing — Firebase auth disabled."
      );
      return null;
    }

    // Format private key properly
    const privateKey = env.FIREBASE_PRIVATE_KEY
      .replace(/\\n/g, "\n")
      .trim();

    // Initialise only once
    if (!admin.apps || admin.apps.length === 0) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
      });

      logger.info("Firebase Admin initialized.");
    } else {
      firebaseApp = admin.app();
    }

    return firebaseApp;
  } catch (err) {
    logger.error("Firebase init error:", err);
    return null;
  }
};

const getAdmin = () => admin;

module.exports = {
  initFirebase,
  getAdmin,
};