from flask import Blueprint, render_template, request
from scripts.ask_gpt import ask_gpt

ai_bp = Blueprint("ai", __name__, url_prefix="/ai")

@ai_bp.route("/", methods=["GET", "POST"])
def ai_home():
    response = ""
    if request.method == "POST":
        prompt = request.form.get("prompt")
        response = ask_gpt(prompt)
    return render_template("ai.html", response=response)
