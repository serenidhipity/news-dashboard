import feedparser
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import pandas as pd
import datetime

class NewsFetcher:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()
        self.feeds = {
            "BBC News": "http://feeds.bbci.co.uk/news/rss.xml",
            "TechCrunch": "http://feeds.feedburner.com/TechCrunch/",
            "CNN": "http://rss.cnn.com/rss/cnn_topstories.rss",
            "Wired": "https://www.wired.com/feed/rss"
        }
        self.categories = {
            "Technology": ["tech", "software", "ai", "apple", "google", "meta", "crypto", "startup"],
            "World": ["war", "election", "politics", "global", "un", "government"],
            "Finance": ["market", "stock", "economy", "fed", "inflation", "banking"],
            "Lifestyle": ["health", "food", "travel", "culture", "design"]
        }

    def _get_sentiment(self, text):
        score = self.analyzer.polarity_scores(text)['compound']
        if score >= 0.05:
            return "Positive", "😊"
        elif score <= -0.05:
            return "Negative", "😔"
        else:
            return "Neutral", "😐"

    def _get_category(self, text):
        text_lower = text.lower()
        for category, keywords in self.categories.items():
            if any(keyword in text_lower for keyword in keywords):
                return category
        return "General"

    def fetch_latest_news(self):
        all_articles = []
        for source, url in self.feeds.items():
            feed = feedparser.parse(url)
            for entry in feed.entries[:10]: # Limit to top 10 per feed
                title = entry.get("title", "")
                description = entry.get("description", entry.get("summary", ""))
                link = entry.get("link", "")
                
                sentiment_label, sentiment_icon = self._get_sentiment(title + " " + description)
                category = self._get_category(title + " " + description)
                
                all_articles.append({
                    "title": title,
                    "description": description,
                    "link": link,
                    "source": source,
                    "sentiment": sentiment_label,
                    "sentiment_icon": sentiment_icon,
                    "category": category,
                    "published": entry.get("published", "")
                })
        
        return all_articles

if __name__ == "__main__":
    fetcher = NewsFetcher()
    news = fetcher.fetch_latest_news()
    print(f"Fetched {len(news)} articles.")
    for article in news[:2]:
        print(f"[{article['category']}] {article['sentiment_icon']} {article['title']} - {article['source']}")
