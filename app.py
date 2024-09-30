from flask import Flask, jsonify
import os
import requests
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

app = Flask(__name__)

SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET')

@app.route('/')
def hello():
    return "Welcome to the Music Ranker App!"

@app.route('/api/search')
def search_track():
    # This is a placeholder. You'll implement the actual Spotify API call here.
    return jsonify({"message": "Search functionality coming soon!"})

if __name__ == '__main__':
    app.run(debug=True)