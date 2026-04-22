# MUSRANKER

Drag-and-drop tier lists for **Spotify artists** and **albums / EPs**.

- **Artists mode**: search Spotify artists, drag them into tiers.
- **Albums mode**: search Spotify albums/EPs (singles are filtered out), drag them into tiers.
- **Export**: save the tier list as a PNG.
- **Restore**: auto-saves per mode; also supports Import/Export JSON sessions.

## Tech overview

- **Backend**: Flask
- **Frontend**: React (served via CDN) + inline Babel (no build step)
- **Spotify**: Client Credentials flow (server-side)

## Requirements

- Python 3.10+ recommended
- A Spotify developer application (Client ID + Client Secret)

## Setup

Create a virtual environment and install dependencies:

```bash
python -m venv .venv
```

```bash
.venv\Scripts\activate
```

```bash
pip install -r requirements.txt
```

Create a `.env` file (based on `.env.example`):

```bash
copy .env.example .env
```

Then fill in:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`

## Run locally

```bash
python app.py
```

Open:

- `http://127.0.0.1:5000/`

## Using the app

- Go to **Rank Artists** or **Rank Albums**
- Search Spotify and drag tiles into **Staging** or the **Tier List**
- Use the Tier List controls:
  - **Load**: load last saved session for this mode
  - **Import JSON** / **Export JSON**: portable backups
  - **New**: start over (clears items + placements)
  - **Clear**: clears placements only
  - **Export PNG**: downloads an image of the tier list

## API

- `GET /search?q=<query>&type=artist|album`

Returns Spotify's search payload.

## Tests

```bash
python -m pytest -q
```

## Deployment notes

This repo includes a `Procfile` for Gunicorn:

```text
web: gunicorn app:app
```

Make sure your host sets environment variables (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`).

## Troubleshooting

- **Site won’t load**: ensure the server is running (`python app.py`) and port `5000` is free.
- **Spotify errors**: confirm your credentials in `.env` and restart the server.
- **Skip Spotify validation (dev only)**: you can set `SKIP_SPOTIFY_VALIDATION=true` to boot the server without credentials.

