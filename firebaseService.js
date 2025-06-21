const admin = require('firebase-admin');
const serviceAccount = require('./anonymous-bot-d6875-firebase-adminsdk-fbsvc-00c277c166.json'); // Replace with your file name if needed

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://anonymous-bot-d6875-default-rtdb.firebaseio.com'
});

const db = admin.database();
module.exports = db;
