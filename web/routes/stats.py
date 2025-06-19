from flask import Blueprint, render_template
import json, os

stats_bp = Blueprint("stats", __name__, url_prefix="/stats")

STATS_FILE = "../.netFRAMEWORK/analytics/stats.json"

@stats_bp.route("/")
def dashboard():
    if os.path.exists(STATS_FILE):
        with open(STATS_FILE) as f:
            data = json.load(f)
    else:
        data = {
            "total_messages": 0,
            "commands_used": {},
            "active_users": 0
        }
    return render_template("stats.html", stats=data)
