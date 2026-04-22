import os

from dotenv import find_dotenv, load_dotenv
from flask import Flask

from app.routes.api import api_bp
from app.routes.web import web_bp
from app.services.spotify import SpotifyClient


def create_app(test_config=None):
    dotenv_path = find_dotenv(usecwd=False)
    if dotenv_path:
        load_dotenv(dotenv_path=dotenv_path)
    else:
        load_dotenv()

    app = Flask(__name__)
    app.config.from_mapping(
        SPOTIFY_CLIENT_ID=os.getenv("SPOTIFY_CLIENT_ID", ""),
        SPOTIFY_CLIENT_SECRET=os.getenv("SPOTIFY_CLIENT_SECRET", ""),
        SPOTIFY_TIMEOUT_SECONDS=10,
    )

    if test_config:
        app.config.update(test_config)

    if not app.config.get("TESTING", False) and not _skip_spotify_validation():
        validate_config(app)

    app.extensions["spotify_client"] = SpotifyClient(
        client_id=app.config["SPOTIFY_CLIENT_ID"],
        client_secret=app.config["SPOTIFY_CLIENT_SECRET"],
        timeout_seconds=app.config["SPOTIFY_TIMEOUT_SECONDS"],
    )

    app.register_blueprint(web_bp)
    app.register_blueprint(api_bp)
    return app


def _skip_spotify_validation() -> bool:
    value = os.getenv("SKIP_SPOTIFY_VALIDATION", "").strip().lower()
    return value in {"1", "true", "yes", "on"}


def validate_config(app):
    missing = []
    if not app.config.get("SPOTIFY_CLIENT_ID"):
        missing.append("SPOTIFY_CLIENT_ID")
    if not app.config.get("SPOTIFY_CLIENT_SECRET"):
        missing.append("SPOTIFY_CLIENT_SECRET")

    if missing:
        missing_str = ", ".join(missing)
        raise RuntimeError(f"Missing required environment variables: {missing_str}")
