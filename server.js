const { Client } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const cors = require('cors');
const fetch = require('node-fetch');
const { saveSession, loadSession } = require('./firebaseService');

const app = express();
app.use(express.json());
app.use(cors());

let sessionData = null;

(async () => {
    sessionData = await loadSession();

    const client = new Client({
        session: sessionData,
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
        console.log('QR RECEIVED - scan in WhatsApp');
    });

    client.on('authenticated', (session) => {
        console.log('🔐 Authenticated');
        saveSession(session);
    });

    client.on('auth_failure', () => {
        console.error('❌ Authentication failed');
    });

    client.on('ready', () => {
        console.log('✅ WhatsApp Bot is ready!');
    });

    client.on('message', async (msg) => {
        console.log(`[${msg.from}]: ${msg.body}`);
        if (msg.body === 'ping') {
            msg.reply('pong');
        }
        fs.appendFileSync('message_logs.txt', `[${msg.from}] ${msg.body}\n`);
    });

    client.initialize();
})();

// Self-ping every 5 minutes to prevent sleeping on Render
setInterval(() => {
    fetch("https://<your-render-url>.onrender.com").catch(() => {});
}, 5 * 60 * 1000);

// Health check route
app.get('/', (req, res) => {
    res.send("📡 WhatsApp Bot Server is running.");
});

app.listen(3000, () => {
    console.log('🌐 Express server running at http://localhost:3000');
});
