const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const admin = require('firebase-admin');
const fs = require('fs');
const qrcode = require('qrcode');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// 🔐 Firebase Admin Init
const serviceAccount = require('./anonymous-bot-d6875-firebase-adminsdk-fbsvc-8757389a7f.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://anonymous-bot-d6875-default-rtdb.firebaseio.com"
});
const db = admin.database();
const sessionRef = db.ref('sessions/current');

// ♻️ WhatsApp Client Init
let client;
function initWhatsApp() {
  client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  client.on('qr', async (qr) => {
    console.log('QR RECEIVED');
    await sessionRef.set({ status: 'Disconnected', qr });
  });

  client.on('ready', async () => {
    console.log('✅ WhatsApp Ready');
    await sessionRef.set({ status: 'Connected', qr: null });
  });

  client.on('disconnected', async () => {
    console.log('❌ WhatsApp Disconnected');
    await sessionRef.set({ status: 'Disconnected', qr: null });
  });

  client.initialize();
}

initWhatsApp();

// 🧠 API Endpoint to force reconnect
app.get('/api/reconnect', async (req, res) => {
  if (client) {
    await client.destroy();
  }
  initWhatsApp();
  res.json({ status: 'restarting' });
});

// 🌐 Serve UI
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Server is running at http://localhost:${PORT}`);
});
