import base64
import threading
import time

import requests


class SpotifyAPIError(Exception):
    pass


class SpotifyConfigurationError(SpotifyAPIError):
    pass


class SpotifyClient:
    TOKEN_URL = "https://accounts.spotify.com/api/token"
    SEARCH_URL = "https://api.spotify.com/v1/search"

    def __init__(self, client_id, client_secret, timeout_seconds=10):
        self.client_id = client_id
        self.client_secret = client_secret
        self.timeout_seconds = timeout_seconds
        self._access_token = None
        self._expires_at = 0
        self._lock = threading.Lock()

    def search(self, query, search_type, limit=10):
        token = self._get_access_token()
        headers = {"Authorization": f"Bearer {token}"}
        params = {"q": query, "type": search_type, "limit": limit}

        try:
            response = requests.get(
                self.SEARCH_URL,
                headers=headers,
                params=params,
                timeout=self.timeout_seconds,
            )
            response.raise_for_status()
        except requests.RequestException as exc:
            raise SpotifyAPIError("Failed to fetch data from Spotify API") from exc

        return response.json()

    def _get_access_token(self):
        with self._lock:
            if self._access_token and time.time() < self._expires_at - 30:
                return self._access_token

        self._refresh_access_token()

        with self._lock:
            return self._access_token

    def _refresh_access_token(self):
        if not self.client_id or not self.client_secret:
            raise SpotifyConfigurationError(
                "Spotify credentials are not configured on the server"
            )

        auth_string = f"{self.client_id}:{self.client_secret}"
        auth_base64 = base64.b64encode(auth_string.encode("utf-8")).decode("utf-8")
        headers = {
            "Authorization": f"Basic {auth_base64}",
            "Content-Type": "application/x-www-form-urlencoded",
        }
        payload = {"grant_type": "client_credentials"}

        try:
            response = requests.post(
                self.TOKEN_URL,
                headers=headers,
                data=payload,
                timeout=self.timeout_seconds,
            )
            response.raise_for_status()
        except requests.RequestException as exc:
            raise SpotifyAPIError("Failed to obtain Spotify access token") from exc

        token_response = response.json()
        access_token = token_response.get("access_token")
        expires_in = token_response.get("expires_in", 3600)

        if not access_token:
            raise SpotifyAPIError("Spotify token response did not include access_token")

        with self._lock:
            self._access_token = access_token
            self._expires_at = time.time() + int(expires_in)
