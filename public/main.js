import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';
import QRCode from 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';

// Firebase Config (Replace with your actual values)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
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
