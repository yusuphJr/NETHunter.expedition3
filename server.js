const { Client, LocalAuth } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode');
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend/public')));

// WhatsApp client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// QR event
client.on('qr', async (qr) => {
  console.log('QR RECEIVED. Sending to client...');
  const qrDataURL = await qrcode.toDataURL(qr);
  io.emit('qr', qrDataURL);
});

// Ready event
client.on('ready', () => {
  console.log('✅ WhatsApp Bot is ready!');
  io.emit('ready', 'WhatsApp is ready!');
});

// Message handler
client.on('message', (msg) => {
  console.log(`[${msg.from}]: ${msg.body}`);
  if (msg.body === 'ping') {
    msg.reply('pong');
  }
  fs.appendFileSync('message_logs.txt', `[${msg.from}] ${msg.body}\n`);
});

// Start bot
client.initialize();

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/public/index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Server is running at http://localhost:${PORT}`);
});
