"""Basic backend for live sentiment analysis frontend."""
from flask import Flask

# Blueprints
from api.api import API

APP = Flask(__name__)
APP.register_blueprint(API)
