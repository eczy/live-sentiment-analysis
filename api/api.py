"""API for live sentiment analysis backend."""
from flask import Blueprint, request, jsonify
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.tokenize.punkt import PunktSentenceTokenizer

nltk.downloader.download("punkt")
nltk.downloader.download("vader_lexicon")
SIA = SentimentIntensityAnalyzer()
PST = PunktSentenceTokenizer()

API = Blueprint("api", "api", url_prefix="/api")


@API.route("/sentiment", methods=["POST"])
def api_sentiment():
    """
    Split text into paragraphs and sentences and perform sentiment analysis
    at the sentence level (preserves whitespace between sentences)
    """
    text = request.json.get("text")
    response = []
    for paragraph in text.splitlines():
        paragraph_sentences = []
        sentence_bounds = [bounds for bounds in PST.span_tokenize(paragraph)]
        for i, bounds in enumerate(sentence_bounds):
            start, end = bounds
            sentence = paragraph[start: end]
            paragraph_sentences.append({
                "sentence": sentence,
                "polarity": SIA.polarity_scores(sentence)
            })
            if i < len(sentence_bounds) - 1:
                next_start, _ = sentence_bounds[i + 1]
                if next_start >= end + 1:
                    sentence = paragraph[end: next_start]
                    paragraph_sentences.append(
                        {
                            "sentence": sentence,
                            "polarity": SIA.polarity_scores(sentence)
                        }
                    )
        response.append(paragraph_sentences)
    return jsonify(response)
