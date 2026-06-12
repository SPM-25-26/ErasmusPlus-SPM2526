import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://localhost:7097';
const MUNICIPALITY_ID = '6c44abbd-72f1-4906-b22a-467cc97cf7b6'; // ID temporaneo di test

function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Recuperiamo il token di autenticazione salvato al login
        const token = localStorage.getItem('token'); 

        const response = await fetch(`${API_BASE_URL}/api/Articles?municipalityId=${MUNICIPALITY_ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error("Errore nel caricamento degli articoli:", err);
        setError("Impossibile caricare gli articoli. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>Caricamento articoli in corso...</div>;
  if (error) return <div style={{ color: '#ef5350', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>{error}</div>;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>

      <Link to="/home" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Home
      </Link>

      <header style={{ marginBottom: '50px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginBottom: '15px' }}>Articles</h1>
        <p style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>News and updates from the municipality.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '40px' 
      }}>
        {articles.map((article) => (
          <Link to={`/ArticleDetail/${article.id}`} key={article.id} style={{ 
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#1E1E1E', 
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            border: '1px solid #333',
            transition: 'transform 0.2s'
          }}>
            {}
            <img 
              src={article.imagePath ? `${API_BASE_URL}${article.imagePath}` : 'https://via.placeholder.com/800x400/1E1E1E/4DA8DA?text=No+Image'} 
              alt={article.title} 
              style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ color: '#4DA8DA', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="far fa-clock"></i> {article.timeToRead || 'N/A'}
                </span>
              </div>
              <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '1.4rem', lineHeight: '1.3' }}>
                {article.title}
              </h3>
              <p style={{ color: '#AAAAAA', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px 0', flexGrow: 1 }}>
                {article.subtitle}
              </p>
              <div style={{ color: '#4DA8DA', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Read More &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ArticlesList;