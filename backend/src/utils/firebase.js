const admin = require("firebase-admin");

// Fix: Replace `\n` in private key
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

const hasRequiredEnv =
  !!process.env.FIREBASE_PROJECT_ID &&
  !!process.env.FIREBASE_CLIENT_EMAIL &&
  !!privateKey;

// Initialize Firebase Admin with Service Account (guarded to avoid crashing on missing env)
if (!admin.apps.length && hasRequiredEnv) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: privateKey,
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });
    // eslint-disable-next-line no-console
    console.log("Firebase Admin initialized");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to initialize Firebase Admin:", e?.message || e);
  }
} else if (!hasRequiredEnv) {
  // eslint-disable-next-line no-console
  console.warn(
    "Firebase Admin not initialized: missing FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY"
  );
}

module.exports = admin;


