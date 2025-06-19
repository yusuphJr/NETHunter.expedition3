from flask import Blueprint, render_template, request

websearch_bp = Blueprint("websearch", __name__, url_prefix="/web")

@websearch_bp.route("/", methods=["GET", "POST"])
def web_home():
    result = ""
    if request.method == "POST":
        query = request.form.get("query")
        result = f"Web result for: {query}"  # placeholder
    return render_template("web.html", result=result)
