import pytest

from app import create_app
from app.services.spotify import SpotifyAPIError, SpotifyConfigurationError


class FakeSpotify:
    def __init__(self):
        self.calls = []

    def search(self, query, search_type, limit):
        self.calls.append((query, search_type, limit))
        return {"artists": {"items": [{"name": "Example Artist"}]}}


@pytest.fixture
def client():
    app = create_app({"TESTING": True, "SPOTIFY_CLIENT_ID": "", "SPOTIFY_CLIENT_SECRET": ""})
    app.extensions["spotify_client"] = FakeSpotify()
    return app.test_client()


@pytest.mark.parametrize("path", ["/", "/rank_artists", "/rank_albums"])
def test_pages_load(client, path):
    response = client.get(path)
    assert response.status_code == 200


def test_legacy_route_redirects(client):
    response = client.get("/rank_projects")
    assert response.status_code == 301
    assert response.headers["Location"].endswith("/rank_albums")


@pytest.mark.parametrize("query", ["", "   "])
def test_search_requires_nonempty_query(client, query):
    response = client.get("/search", query_string={"q": query, "type": "artist"})
    assert response.status_code == 400


@pytest.mark.parametrize("kind", ["", "playlist", "track"])
def test_search_rejects_invalid_type(client, kind):
    response = client.get("/search", query_string={"q": "Radiohead", "type": kind})
    assert response.status_code == 400


def test_search_calls_spotify_with_normalized_input(client):
    response = client.get("/search", query_string={"q": "  Radiohead ", "type": " ARTIST "})
    assert response.status_code == 200
    assert response.get_json()["artists"]["items"][0]["name"] == "Example Artist"
    assert client.application.extensions["spotify_client"].calls == [("Radiohead", "artist", 10)]


@pytest.mark.parametrize("error,expected", [
    (SpotifyAPIError("Spotify request failed"), 502),
    (SpotifyConfigurationError("Missing credentials"), 500),
])
def test_search_handles_spotify_errors(client, error, expected):
    class BrokenSpotify:
        def search(self, **kwargs):
            raise error
    client.application.extensions["spotify_client"] = BrokenSpotify()
    response = client.get("/search", query_string={"q": "Muse", "type": "album"})
    assert response.status_code == expected
    assert "error" in response.get_json()
