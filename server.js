const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Serve static files from the correct folder
app.use(express.static(path.join(__dirname, 'public')));

// WhatsApp client setup
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Send QR code as base64
let latestQr = '';
client.on('qr', async (qr) => {
    console.log('QR RECEIVED. Sending to client...');
    latestQr = await qrcode.toDataURL(qr);
});

// Endpoint for frontend to fetch QR
app.get('/api/qr', (req, res) => {
    if (!latestQr) return res.status(404).send('QR not ready');
    res.json({ qr: latestQr });
});

// WhatsApp ready log
client.on('ready', () => {
    console.log('✅ WhatsApp Bot is ready!');
});

// Basic message handling
client.on('message', async (msg) => {
    console.log(`[${msg.from}]: ${msg.body}`);
    if (msg.body === 'ping') {
        msg.reply('pong');
    }
    fs.appendFileSync('message_logs.txt', `[${msg.from}] ${msg.body}\n`);
});

client.initialize();

// ✅ Serve your main index.html properly
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🌐 Server is running at http://localhost:${PORT}`);
});
