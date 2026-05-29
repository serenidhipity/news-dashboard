import React, { useEffect, useState } from 'react';
import './App.css';

interface Article {
  title: string;
  description: string;
  link: string;
  source: string;
  sentiment: string;
  sentiment_icon: string;
  category: string;
  published: string;
}

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMood, setSelectedMood] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  const categories = ['All', 'Technology', 'World', 'Finance', 'Lifestyle', 'General'];
  const moods = ['All', 'Positive', 'Neutral', 'Negative'];

  const fetchNews = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:8001/news';
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'All') params.append('category', selectedCategory);
      if (selectedMood !== 'All') params.append('sentiment', selectedMood);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, selectedMood]);

  const handleLike = async (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent opening the link
    try {
      await fetch(`http://localhost:8001/interests/${category}`, { method: 'POST' });
      // Visual feedback without a blocking alert
      console.log(`Prioritizing ${category}`);
      fetchNews(); 
    } catch (error) {
      console.error("Error updating interest:", error);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">📰 BRIEF.AI</div>
        <div className="nav-section">
          <h3>Categories</h3>
          {categories.map((cat) => (
            <div
              key={cat}
              className={`nav-item ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'All' ? '🌐' : cat === 'Technology' ? '💻' : cat === 'World' ? '🌍' : cat === 'Finance' ? '📈' : cat === 'Lifestyle' ? '🥗' : '📄'} {cat}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>Discover Today's Feed</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Personalized news, parsed by sentiment.</p>
          </div>

          {/* Mood Filters */}
          <div className="mood-filters">
            {moods.map((mood) => (
              <button
                key={mood}
                className={`mood-btn ${selectedMood === mood ? 'active' : ''}`}
                onClick={() => setSelectedMood(mood)}
              >
                {mood === 'All' ? '🌈 All' : mood === 'Positive' ? '😊 Positive' : mood === 'Neutral' ? '😐 Neutral' : '😔 Negative'}
              </button>
            ))}
          </div>
        </header>

        {/* News Feed */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            Analyzing latest streams...
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            No articles found matching this specific mix. Try changing filters!
          </div>
        ) : (
          <div className="news-grid">
            {articles.map((article, idx) => (
              <div
                key={idx}
                className="news-card"
                onClick={() => window.open(article.link, '_blank')}
              >
                <div className="card-meta">
                  <span className="source-badge">{article.source}</span>
                  <span className="category-tag">{article.category}</span>
                </div>
                <h2 className="news-title">{article.title}</h2>
                <p className="news-desc">{article.description.replace(/<[^>]*>/g, '')}</p>
                <div className="card-footer">
                  <div className={`sentiment-indicator sentiment-${article.sentiment}`}>
                    <span>{article.sentiment_icon}</span>
                    <span>{article.sentiment}</span>
                  </div>
                  <button
                    className="like-btn"
                    onClick={(e) => handleLike(e, article.category)}
                    title="Show more like this"
                  >
                    ❤️ Prioritize
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
