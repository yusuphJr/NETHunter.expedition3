// firebaseService.js
const admin = require("firebase-admin");
const fs = require("fs");

const serviceAccount = require("./anonymous-bot-d6875-firebase-adminsdk-fbsvc-00c277c166.json"); // Replace with your file name

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://anonymous-bot-d6875-default-rtdb.firebaseio.com/"
});

const db = admin.database();
const sessionRef = db.ref("whatsapp/session");

// Save session data
function saveSession(session) {
  sessionRef.set(session);
}

// Load session data
async function loadSession() {
  const snapshot = await sessionRef.once("value");
  return snapshot.val();
}

module.exports = {
  saveSession,
  loadSession
};
