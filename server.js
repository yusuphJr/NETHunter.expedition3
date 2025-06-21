const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

// Firebase DB connection
const db = require('./firebaseService');

// Init Express
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // serve frontend

// WhatsApp client init
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// QR Code generation
client.on('qr', async (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('📲 QR RECEIVED - scan in WhatsApp');

    await db.ref('sessions/anonymous').set({
        qr: qr,
        status: 'waiting'
    });
});

// Bot is ready
client.on('ready', async () => {
    await db.ref('sessions/anonymous/status').set('connected');
    console.log('✅ WhatsApp Bot is ready!');
});

// Message handler
client.on('message', async (msg) => {
    console.log(`[${msg.from}]: ${msg.body}`);
    if (msg.body === 'ping') msg.reply('pong');

    fs.appendFileSync('message_logs.txt', `[${msg.from}] ${msg.body}\n`);
});

// Start WhatsApp
client.initialize();

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/session/qr', async (req, res) => {
    const snapshot = await db.ref('sessions/anonymous/qr').once('value');
    res.json({ qr: snapshot.val() });
});

app.get('/api/session/status', async (req, res) => {
    const snapshot = await db.ref('sessions/anonymous/status').once('value');
    res.json({ status: snapshot.val() });
});

app.listen(3000, () => {
    console.log('🌐 Express server running at http://localhost:3000');
});
