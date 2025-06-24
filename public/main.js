import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import QRCode from 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';

// Firebase Config (Replace with your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyB1dXaGbG_RPh-wsTFJ8wtu24yiIijd8xU",
  authDomain: "anonymous-bot-d6875.firebaseapp.com",
  databaseURL: "https://anonymous-bot-d6875-default-rtdb.firebaseio.com",
  projectId: "anonymous-bot-d6875",
  storageBucket: "anonymous-bot-d6875.firebasestorage.app",
  messagingSenderId: "892491758317",
  appId: "1:892491758317:web:de79b9b701abdfca29eae4"
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
