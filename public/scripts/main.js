import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB1dXaGbG_RPh-wsTFJ8wtu24yiIijd8xU",
  authDomain: "anonymous-bot-d6875.firebaseapp.com",
  databaseURL: "https://anonymous-bot-d6875-default-rtdb.firebaseio.com",
  projectId: "anonymous-bot-d6875",
  storageBucket: "anonymous-bot-d6875.appspot.com",
  messagingSenderId: "892491758317",
  appId: "1:892491758317:web:de79b9b701abdfca29eae4",
  measurementId: "G-7REFLNPPRN"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const sessionRef = ref(db, 'sessions/current');

const qrCanvas = document.getElementById('qrCanvas');
const statusEl = document.getElementById('status');
const reconnectBtn = document.getElementById('reconnectBtn');
const loader = document.querySelector('.loader-circle');

reconnectBtn.addEventListener('click', () => {
  fetch('/api/reconnect').then(res => res.json()).then(resp => {
    console.log('Reconnect:', resp);
  });
});

onValue(sessionRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;
  if (data.qr) {
    loader.style.display = 'block';
    QRCode.toCanvas(qrCanvas, data.qr, { width: 240 }, err => {
      loader.style.display = err ? 'block' : 'none';
      if (err) console.error(err);
    });
  }
  statusEl.textContent = data.status || 'Disconnected';
  statusEl.className = 'status ' + (data.status === 'Connected' ? 'connected' : 'disconnected');
});

// music controls
const bgMusic = document.getElementById('bg-music');
document.getElementById('playBtn').addEventListener('click', () => {
  if (bgMusic.paused) bgMusic.play();
  else bgMusic.pause();
});
