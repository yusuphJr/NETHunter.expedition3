const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Serve frontend
app.use(express.static(path.join(__dirname, 'frontend', 'public')));

// WhatsApp client setup
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Send QR code to frontend
let latestQr = '';
client.on('qr', async (qr) => {
    console.log('QR RECEIVED. Sending to client...');
    latestQr = await qrcode.toDataURL(qr);
});

// Send QR to frontend
app.get('/api/qr', (req, res) => {
    if (!latestQr) return res.status(404).send('QR not ready');
    res.json({ qr: latestQr });
});

// WhatsApp ready
client.on('ready', () => {
    console.log('✅ WhatsApp Bot is ready!');
});

// Message listener
client.on('message', async (msg) => {
    console.log(`[${msg.from}]: ${msg.body}`);
    if (msg.body === 'ping') {
        msg.reply('pong');
    }
    fs.appendFileSync('message_logs.txt', `[${msg.from}] ${msg.body}\n`);
});

client.initialize();

// Root route for frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🌐 Server is running at http://localhost:${PORT}`);
});
