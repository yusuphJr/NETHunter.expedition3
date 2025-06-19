from flask import Blueprint, render_template, request, redirect, url_for
import json, os

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")

SETTINGS_FILE = "../.netFRAMEWORK/settings.json"

def load_settings():
    if os.path.exists(SETTINGS_FILE):
        with open(SETTINGS_FILE) as f:
            return json.load(f)
    return {
        "anti_delete": False,
        "anti_link": False,
        "banned_words_enabled": False
    }

def save_settings(settings):
    with open(SETTINGS_FILE, "w") as f:
        json.dump(settings, f, indent=4)

@admin_bp.route("/", methods=["GET", "POST"])
def dashboard():
    settings = load_settings()
    if request.method == "POST":
        settings["anti_delete"] = "anti_delete" in request.form
        settings["anti_link"] = "anti_link" in request.form
        settings["banned_words_enabled"] = "banned_words_enabled" in request.form
        save_settings(settings)
        return redirect(url_for("admin.dashboard"))
    return render_template("admin.html", settings=settings)
