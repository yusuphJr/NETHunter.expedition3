import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import QRCode from 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';

// Firebase Config (Replace with your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyAsZp1qE5VTzVJO3H9eZwjqWkV3YvpyJ_4",
  authDomain: "anon-bot-a8a5e.firebaseapp.com",
  projectId: "anon-bot-a8a5e",
  storageBucket: "anon-bot-a8a5e.firebasestorage.app",
  messagingSenderId: "508890097191",
  appId: "1:508890097191:web:3ec054ba0bfffff6ce5002",
  measurementId: "G-0GWDNEXQSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const qrCanvas = document.getElementById('qrcode');
const statusText = document.querySelector('#status span');
const refreshBtn = document.getElementById('refreshBtn');
const reconnectBtn = document.getElementById('reconnectBtn');

function drawQR(qrString) {
  QRCode.toCanvas(qrCanvas, qrString, { width: 250 }, function (error) {
    if (error) console.error(error);
  });
}

// Listen to status + qr updates
const sessionRef = ref(db, 'sessions/current');
onValue(sessionRef, (snapshot) => {
  const data = snapshot.val();
  statusText.innerText = data?.status || 'Unknown';
  if (data?.qr) drawQR(data.qr);
});

// Refresh page
refreshBtn.onclick = () => location.reload();

// Call backend to reconnect
reconnectBtn.onclick = () => {
  fetch('/api/reconnect').then(() => alert('Reconnecting...'));
};
