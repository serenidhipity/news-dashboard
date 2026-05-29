from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from news_fetcher import NewsFetcher
from typing import Optional

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fetcher = NewsFetcher()
# Simple in-memory storage for user interests (Phase 3)
user_interests = {"Technology": 1, "World": 1, "Finance": 1, "Lifestyle": 1, "General": 1}

@app.get("/")
def read_root():
    return {"message": "News Dashboard API is running"}

@app.get("/news")
def get_news(category: Optional[str] = None, sentiment: Optional[str] = None):
    articles = fetcher.fetch_latest_news()
    
    # Apply filters
    if category:
        articles = [a for a in articles if a['category'].lower() == category.lower()]
    if sentiment:
        articles = [a for a in articles if a['sentiment'].lower() == sentiment.lower()]
    
    # Sort by interest (Phase 3)
    articles.sort(key=lambda x: user_interests.get(x['category'], 0), reverse=True)
    
    return articles

@app.post("/interests/{category}")
def update_interest(category: str):
    if category in user_interests:
        user_interests[category] += 1
    return {"status": "success", "interests": user_interests}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
