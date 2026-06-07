import admin from "firebase-admin";
import env from "./env.js";

// ── Prevent duplicate init in dev hot reload ──────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      privateKey: env.FIREBASE_PRIVATE_KEY,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
    }),
  });
  console.log("✅ Firebase Admin initialized");
}

export const adminAuth = admin.auth();

/**
 * Verify Firebase ID token from client
 * @param {string} idToken
 * @returns {Promise<admin.auth.DecodedIdToken>}
 */
export const verifyFirebaseToken = async (idToken) => {
  return await adminAuth.verifyIdToken(idToken);
};

/**
 * Get Firebase user by UID
 * @param {string} uid
 */
export const getFirebaseUser = async (uid) => {
  return await adminAuth.getUser(uid);
};

/**
 * Delete Firebase user (for account deletion)
 * @param {string} uid
 */
export const deleteFirebaseUser = async (uid) => {
  return await adminAuth.deleteUser(uid);
};

export default admin;