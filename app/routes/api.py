from flask import Blueprint, current_app, jsonify, request

from app.services.spotify import SpotifyAPIError, SpotifyConfigurationError

api_bp = Blueprint("api", __name__)


@api_bp.route("/search")
def search():
    query = request.args.get("q", "").strip()
    search_type = request.args.get("type", "").strip().lower()

    if not query or not search_type:
        return jsonify({"error": "No search query or type provided"}), 400

    if search_type not in {"artist", "album"}:
        return jsonify({"error": "Invalid search type. Use 'artist' or 'album'."}), 400

    spotify_client = current_app.extensions.get("spotify_client")
    if spotify_client is None:
        return jsonify({"error": "Spotify client is not configured"}), 500

    try:
        payload = spotify_client.search(query=query, search_type=search_type, limit=10)
    except SpotifyConfigurationError as exc:
        return jsonify({"error": str(exc)}), 500
    except SpotifyAPIError as exc:
        return jsonify({"error": str(exc)}), 502

    return jsonify(payload)
