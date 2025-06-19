const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const app = express();
const client = new Client({ authStrategy: new LocalAuth() });

client.on('qr', qr => {
    console.log('Scan this QR code:', qr);
});
client.on('ready', () => {
    console.log('WhatsApp bot is ready!');
});
client.on('message', async msg => {
    console.log(`[${msg.from}]: ${msg.body}`);
    // Forward to Python backend if needed
});
client.initialize();

app.get('/', (req, res) => res.send("Bot backend is alive."));
app.listen(3000, () => console.log('Express running on http://localhost:3000'));
