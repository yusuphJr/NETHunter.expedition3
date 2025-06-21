// firebase_session.js
const admin = require("firebase-admin");
const axios = require("axios");

// Use the same DB URL from your Firebase project
const DATABASE_URL = "https://anonymous-bot-d6875-default-rtdb.firebaseio.com";

// Service Account JSON – get from Firebase Console > Project Settings > Service Accounts
const serviceAccount = require("../serviceAccountKey.json"); // << You must download this manually and keep it safe

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: DATABASE_URL,
});

const db = admin.database();
const SESSION_REF = "whatsapp_sessions/";

module.exports = {
  saveSession: async (sessionId, sessionData) => {
    await db.ref(SESSION_REF + sessionId).set(sessionData);
  },

  getSession: async (sessionId) => {
    const snapshot = await db.ref(SESSION_REF + sessionId).once("value");
    return snapshot.exists() ? snapshot.val() : null;
  },

  deleteSession: async (sessionId) => {
    await db.ref(SESSION_REF + sessionId).remove();
  }
};
