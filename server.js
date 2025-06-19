const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// QR Code generation
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR RECEIVED - scan in WhatsApp');
});

// Bot is ready
client.on('ready', () => {
    console.log('✅ WhatsApp Bot is ready!');
});

// Incoming message handler
client.on('message', async (msg) => {
    console.log(`[${msg.from}]: ${msg.body}`);
    // Example command handling
    if (msg.body === 'ping') {
        msg.reply('pong');
    }

    // Log message to file (optional)
    fs.appendFileSync('message_logs.txt', `[${msg.from}] ${msg.body}\n`);
});

// Start WhatsApp client
client.initialize();

// Basic Express endpoint for health check
app.get('/', (req, res) => {
    res.send("📡 WhatsApp Bot Server is running.");
});

app.listen(3000, () => {
    console.log('🌐 Express server running at http://localhost:3000');
});
