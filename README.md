# Personalized News Dashboard 

A modern, AI-powered news aggregator built with **React** and **FastAPI**. It pulls real-time headlines from major RSS feeds, analyzes their sentiment using NLP, and learns your interests to prioritize your feed.

## ✨ Features
- **Real-time Ingestion**: Pulls from BBC, TechCrunch, Wired, and CNN.
- **Sentiment Analysis**: Automatically tags articles as Positive 😊, Neutral 😐, or Negative 😔 using VADER NLP.
- **Interest Ranking**: Remembers which categories you "Prioritize" and floats them to the top.
- **Mood Filtering**: Filter your feed by sentiment to match your current vibe.
- **Cinematic UI**: A clean, responsive dashboard with a focus on readability.

## 🛠️ Tech Stack
- **Frontend**: React, TypeScript, Vite, Vanilla CSS.
- **Backend**: FastAPI (Python), Feedparser, VaderSentiment, Pandas.

## 🚀 Getting Started

### Backend
1. `cd backend`
2. `pip install fastapi uvicorn feedparser vaderSentiment pandas`
3. `python main.py`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`



