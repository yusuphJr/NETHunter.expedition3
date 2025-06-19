from flask import Flask, render_template
from routes.ai import ai_bp
from routes.websearch import websearch_bp
from routes.media import media_bp
from routes.toolkit import toolkit_bp

app = Flask(__name__)
app.secret_key = "anonymous_bot_secret"

# Register Blueprints
app.register_blueprint(ai_bp)
app.register_blueprint(websearch_bp)
app.register_blueprint(media_bp)
app.register_blueprint(toolkit_bp)

@app.route('/')
def index():
    return render_template("index.html")

if __name__ == '__main__':
    app.run(debug=True, port=10000)
