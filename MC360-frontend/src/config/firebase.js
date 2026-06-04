import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import env from "./env";

// ── Firebase Config ───────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
};

// ── Init (prevent duplicate app init in dev HMR) ──────────────────────────
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ── Auth instance ─────────────────────────────────────────────────────────
export const auth = getAuth(app);

// ── Providers ─────────────────────────────────────────────────────────────
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// ── Auth helpers ──────────────────────────────────────────────────────────

/**
 * Register with email and password
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 */
export const registerWithEmail = async (email, password, displayName) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  return result;
};

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 */
export const loginWithEmail = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

/**
 * Login with Google popup
 */
export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

/**
 * Send password reset email
 * @param {string} email
 */
export const resetPassword = async (email) => {
  return await sendPasswordResetEmail(auth, email);
};

/**
 * Sign out current user
 */
export const logoutUser = async () => {
  return await signOut(auth);
};

/**
 * Get Firebase ID token for backend auth
 * @returns {Promise<string>} ID token
 */
export const getIdToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user found");
  return await user.getIdToken(true);   // true = force refresh
};

/**
 * Subscribe to auth state changes
 * @param {function} callback
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default app;