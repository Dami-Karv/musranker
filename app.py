from flask import Flask, render_template, request, jsonify
import requests
from dotenv import load_dotenv
import os
import base64

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/rank_artists')
def rank_artists():
    return render_template('rank.html', type='artists', title='Rank Artists')

@app.route('/rank_projects')
def rank_projects():
    return render_template('rank.html', type='albums', title='Rank Albums')

@app.route('/search')
def search():
    query = request.args.get('q')
    search_type = request.args.get('type')
    if not query or not search_type:
        return jsonify({"error": "No search query or type provided"}), 400

    access_token = get_spotify_access_token()
    if not access_token:
        return jsonify({"error": "Failed to obtain Spotify access token"}), 500

    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.get(f'https://api.spotify.com/v1/search?q={query}&type={search_type}&limit=10', headers=headers)
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to fetch data from Spotify API"}), response.status_code

    return jsonify(response.json())

def get_spotify_access_token():
    auth_string = f"{SPOTIFY_CLIENT_ID}:{SPOTIFY_CLIENT_SECRET}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": "Basic " + auth_base64,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {"grant_type": "client_credentials"}
    result = requests.post(url, headers=headers, data=data)
    json_result = result.json()
    token = json_result.get("access_token")
    return token

if __name__ == '__main__':
    app.run(debug=True)