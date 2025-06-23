const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

let latestQr = null;
let isClientReady = false;

// WhatsApp Client with LocalAuth (persistent sessions)
const client = new Client({
    authStrategy: new LocalAuth(), // saves session in .wwebjs_auth/
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
});

// ✅ Emit QR when received
client.on('qr', async (qr) => {
    try {
        const qrImage = await qrcode.toDataURL(qr);
        latestQr = qrImage;
        isClientReady = false;
        console.log('📲 QR code generated.');
    } catch (error) {
        console.error('❌ Failed to generate QR code:', error);
    }
});

// ✅ Mark session as ready
client.on('ready', () => {
    console.log('🤖 WhatsApp client is ready!');
    isClientReady = true;
    latestQr = null; // QR no longer needed
});

// ✅ Message logging
client.on('message', async (msg) => {
    console.log(`[${msg.from}]: ${msg.body}`);
    if (msg.body.toLowerCase() === 'ping') {
        msg.reply('pong');
    }
    fs.appendFileSync('message_logs.txt', `[${msg.from}] ${msg.body}\n`);
});

// ✅ Handle authentication failures
client.on('auth_failure', (msg) => {
    console.error('🚨 AUTH FAILURE:', msg);
    isClientReady = false;
});

// ✅ Reconnect on disconnect
client.on('disconnected', (reason) => {
    console.warn('⚠️ Client disconnected:', reason);
    isClientReady = false;
});

// 📦 Start the WhatsApp client
client.initialize();

// ✅ Static frontend files (served from public/)
app.use(express.static(path.join(__dirname, 'public')));

// 📡 API — Get QR Code
app.get('/api/qr', (req, res) => {
    if (latestQr) {
        res.json({ qr: latestQr });
    } else {
        res.status(404).json({ error: 'QR code not available yet.' });
    }
});

// 📡 API — Session Status
app.get('/api/status', (req, res) => {
    res.json({
        ready: isClientReady,
        timestamp: new Date().toISOString(),
    });
});

// 🔁 API — Reconnect Manually
app.post('/api/reconnect', (req, res) => {
    try {
        client.destroy().then(() => {
            client.initialize();
            res.json({ status: 'Reconnecting...' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Reconnect failed.', details: err });
    }
});

// 🌐 Route fallback to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🚀 Start Express Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🌐 Server is running at http://localhost:${PORT}`);
});
