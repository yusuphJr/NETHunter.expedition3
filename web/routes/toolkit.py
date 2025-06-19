from flask import Blueprint, render_template

toolkit_bp = Blueprint("toolkit", __name__, url_prefix="/toolkit")

@toolkit_bp.route("/", methods=["GET"])
def toolkit_home():
    return render_template("toolkit.html")
