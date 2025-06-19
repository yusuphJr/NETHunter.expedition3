from flask import Flask, request, jsonify, render_template, send_file
import os, json
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

SESSION_DIR = "./session_data"
if not os.path.exists(SESSION_DIR):
    os.makedirs(SESSION_DIR)

@app.route('/')
def index():
    return render_template("dashboard.html")  # You'll need to create templates/dashboard.html

# API: Create Session Token
@app.route('/api/session', methods=['POST'])
def create_session():
    data = request.get_json()
    username = data.get("username")

    if not username:
        return jsonify({"error": "Username required"}), 400

    token = os.urandom(32).hex()
    session_data = {
        "user": username,
        "token": token,
        "created_at": datetime.utcnow().isoformat(),
        "active": True
    }

    session_path = os.path.join(SESSION_DIR, f"session_{username}.json")
    with open(session_path, "w") as f:
        json.dump(session_data, f, indent=4)

    return jsonify({"status": "success", "token": token})

# API: Get Logs
@app.route('/api/logs')
def logs():
    try:
        with open('message_logs.txt', 'r') as f:
            return jsonify({"logs": f.read()})
    except FileNotFoundError:
        return jsonify({"logs": ""})

# API: Fetch Chat Messages (simulate or extend later)
@app.route('/api/messages')
def messages():
    return jsonify([
        {"from": "User1", "message": "Hello"},
        {"from": "User2", "message": "ncs search Alan Walker"}
    ])

# API: Export Stats CSV
@app.route('/api/stats/export')
def export_stats():
    filepath = "./stats.csv"
    with open(filepath, 'w') as f:
        f.write("User,Command,Time\nadmin,mp3 search,2025-06-18")
    return send_file(filepath, as_attachment=True)

if __name__ == '__main__':

    import os
port = int(os.environ.get("PORT", 5000))
app.run(host="0.0.0.0", port=port, debug=True)

