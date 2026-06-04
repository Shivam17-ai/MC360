const env = {
  // ── API ──────────────────────────────────────────────────────────────
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || "http://localhost:5000",

  // ── Firebase ─────────────────────────────────────────────────────────
  FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || "",
  FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || "",

  // ── App ──────────────────────────────────────────────────────────────
  APP_NAME: "MedConnect360",
  APP_VERSION: "1.0.0",
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE || "development",
};

// ── Validation (warns in console if any key is missing in prod) ───────────
if (env.IS_PROD) {
  const required = [
    "FIREBASE_API_KEY",
    "FIREBASE_AUTH_DOMAIN",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_APP_ID",
    "API_URL",
  ];
  required.forEach((key) => {
    if (!env[key]) {
      console.warn(`[MC360] Missing environment variable: VITE_${key}`);
    }
  });
}

export default env;