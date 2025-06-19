# 🕵️‍♂️ Anonymous NETHunter Bot — WhatsApp Automation Framework

Welcome to **NETHunter.expedition3**, a powerful, full-stack WhatsApp automation system — combining the elegance of a modern Flask frontend with the performance and flexibility of a Node.js + Python backend.

> 💬 Control. Automate. Visualize. With Style.

---

## 🚀 Features

- ⚙️ Advanced WhatsApp Automation using `whatsapp-web.js`
- 🎮 Fun text-based games and AI-powered conversations
- 🌍 Translator with real-time message editing
- 📦 Download manager with media previews and progress tracking
- ☁️ Cloud integration (Google Drive, MediaFire)
- 🛡️ Anti-bot, anti-delete, banned word systems
- 📊 Full GUI via terminal (`.netFRAMEWORK`) + Web dashboard
- 🔊 TTS, search, weather, football stats, and more
- 🧠 ChatGPT integration

---

## 🖥️ Frontend (Flask Web Dashboard)

- URL-friendly dashboard
- Built with Flask, Jinja2, SocketIO
- Live terminal logs and action buttons
- Dark hacker-inspired aesthetic (editable in `templates/dashboard.html`)

---

## ⚙️ Backend Stack

| Layer       | Tech                            |
|-------------|----------------------------------|
| Web UI      | Flask, Socket.IO                |
| WhatsApp    | `whatsapp-web.js`               |
| AI / Logic  | Python (with GPT, translators)  |
| Terminal    | `.netFRAMEWORK` GUI (ASCII UI)  |

---

## 🧩 How Pairing Works (Session Setup)

1. 🔒 Start the bot (via terminal or backend)
2. 🔗 It opens a WhatsApp Web session using `whatsapp-web.js`
3. 🖼️ Scan QR code (shown in terminal or Flask dashboard)
4. 💾 A session file is saved automatically (no need to scan again)
5. ⚡ Next time, it boots instantly with saved session

### Session Storage:
- Stored in `session/` or `auth/session.json`
- You can delete this to reset pairing

---

## 🌐 How to Polish the Frontend

### 📁 File: `web/templates/dashboard.html`

- Uses Jinja2 + HTML — easy to customize
- Here are ways to improve it:

#### ✅ Suggestions:

| Task                          | Code/File                            |
|-------------------------------|---------------------------------------|
| 🖤 Dark Theme                  | Add Bootstrap Dark / Tailwind         |
| 🧠 AI Interface                | Add ChatGPT console box (via textarea + JS) |
| 📊 Terminal-like Logs         | Use `<div id="log-area">` with auto-scroll JS |
| 📡 QR Code or Session Box     | Display QR dynamically using `/qr` route |
| 📦 Buttons (Download, Deploy) | Use `<button>` elements tied to JS events |
| 💻 Style                      | Add `/static/style.css` + custom JS   |

Let me know if you want me to:

- 💅 Polish the HTML for you
- 🎨 Add custom CSS / dark themes
- 📟 Auto-load logs into dashboard
- 📸 Render the QR code visually in the frontend

---

## 🧪 Local Development

```bash
# 1. Clone the repo
git clone https://github.com/yusuphJr/NETHunter.expedition3

# 2. Install backend deps
cd web
pip install -r requirements.txt

# 3. Run the web dashboard
python app.py
