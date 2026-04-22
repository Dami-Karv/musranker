from flask import Blueprint, redirect, render_template, url_for

web_bp = Blueprint("web", __name__)


@web_bp.route("/")
def home():
    return render_template("home.html")


@web_bp.route("/rank_artists")
def rank_artists():
    return render_template(
        "rank.html",
        title="Rank Artists",
        search_type="artist",
        item_type_label="artists",
    )


@web_bp.route("/rank_albums")
def rank_albums():
    return render_template(
        "rank.html",
        title="Rank Albums",
        search_type="album",
        item_type_label="albums",
    )


@web_bp.route("/rank_projects")
def rank_projects_legacy():
    return redirect(url_for("web.rank_albums"), code=301)
