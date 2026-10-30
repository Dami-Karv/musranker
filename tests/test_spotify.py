import pytest
import requests

from app.services.spotify import SpotifyAPIError, SpotifyClient, SpotifyConfigurationError


class Response:
    def __init__(self, data):
        self.data = data

    def raise_for_status(self):
        return None

    def json(self):
        return self.data


def test_missing_credentials_do_not_trigger_network(monkeypatch):
    client = SpotifyClient("", "")
    with pytest.raises(SpotifyConfigurationError):
        client.search("anything", "artist")


def test_token_is_reused(monkeypatch):
    counts = {"token": 0, "search": 0}

    def post(url, **kwargs):
        counts["token"] += 1
        return Response({"access_token": "demo", "expires_in": 3600})

    def get(url, **kwargs):
        counts["search"] += 1
        assert kwargs["headers"]["Authorization"] == "Bearer demo"
        return Response({"artists": {"items": []}})

    monkeypatch.setattr(requests, "post", post)
    monkeypatch.setattr(requests, "get", get)
    client = SpotifyClient("id", "secret")
    client.search("a", "artist")
    client.search("b", "artist")
    assert counts == {"token": 1, "search": 2}


def test_missing_access_token_is_reported(monkeypatch):
    monkeypatch.setattr(requests, "post", lambda *a, **kw: Response({}))
    with pytest.raises(SpotifyAPIError, match="access_token"):
        SpotifyClient("id", "secret").search("a", "album")


def test_network_failure_is_sanitized(monkeypatch):
    def failed(*args, **kwargs):
        raise requests.Timeout("private upstream details")

    monkeypatch.setattr(requests, "post", failed)
    with pytest.raises(SpotifyAPIError, match="Failed to obtain Spotify access token"):
        SpotifyClient("id", "secret").search("a", "album")
