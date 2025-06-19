from flask import Flask, jsonify, request, render_template, send_file
import json, os
from datetime import datetime

app = Flask(__name__)

# Session path
SESSION_FOLDER = './session_data'
if not os.path.exists(SESSION_FOLDER): os.makedirs(SESSION_FOLDER)

@app.route('/')
def home():
    return render_template('dashboard.html')

@app.route('/api/session', methods=['POST'])
def create_session():
    data = request.get_json()
    username = data.get('username')
    token = os.urandom(32).hex()
    session_file = os.path.join(SESSION_FOLDER, f'{username}.json')
    
    with open(session_file, 'w') as f:
        json.dump({
            'user': username,
            'token': token,
            'created_at': datetime.utcnow().isoformat(),
            'active': True
        }, f, indent=4)
    
    return jsonify({'status': 'success', 'token': token})

@app.route('/api/logs')
def logs():
    return jsonify({"log": "Logs from bot..."})

@app.route('/api/messages')
def messages():
    # Simulate loading messages
    return jsonify([
        {"from": "User1", "message": "Hello bot!"},
        {"from": "User2", "message": "Download mp3 search Alan Walker"}
    ])

@app.route('/api/stats/export')
def export_stats():
    sample_path = './stats.csv'
    with open(sample_path, 'w') as f:
        f.write("User,Command,Time\nadmin,mp3 search,2025-06-18")
    return send_file(sample_path, as_attachment=True)

if __name__ == '__main__':
    app.run(port=5000, debug=True)
