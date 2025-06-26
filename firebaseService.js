var admin = require("firebase-admin");

var serviceAccount = require("./anonymous-bot-d6875-firebase-adminsdk-fbsvc-9cf8d83abf.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://anonymous-bot-d6875-default-rtdb.firebaseio.com"
});
