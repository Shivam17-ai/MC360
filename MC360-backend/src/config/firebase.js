const admin = require("firebase-admin");
const env = require("./env");
const logger = require("../utils/logger");

let firebaseApp = null;

const initFirebase = () => {
  try {
    if (
      !env.FIREBASE_PROJECT_ID ||
      !env.FIREBASE_PRIVATE_KEY ||
      !env.FIREBASE_CLIENT_EMAIL
    ) {
      logger.warn("Firebase credentials missing — Firebase auth disabled.");
      return null;
    }

    if (!admin.apps || admin.apps.length === 0) {
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          privateKey: env.FIREBASE_PRIVATE_KEY,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      logger.info("Firebase Admin initialized.");
    } else {
      firebaseApp = admin.apps[0];
    }

    return firebaseApp;
  } catch (err) {
    logger.error(`Firebase init error: ${err.message}`);
    return null;
  }
};

const getAdmin = () => admin;

module.exports = { initFirebase, getAdmin };