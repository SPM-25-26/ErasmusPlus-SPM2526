import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'https://localhost:7097'; 

function ArticleDetail() {
  const { id } = useParams(); 
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        const token = localStorage.getItem('token'); 

        const response = await fetch(`${API_BASE_URL}/api/Articles/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          throw new Error("Articolo non trovato.");
        }
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setArticle(data);
      } catch (err) {
        console.error("Errore caricamento dettaglio:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleDetail();
    }
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>Caricamento articolo...</div>;
  if (error) return <div style={{ color: '#ef5350', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>{error}</div>;
  if (!article) return null;

  const sortedParagraphs = article.paragraphs || [];

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/ArticlesList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Articles
      </Link>

      <article>
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', color: '#FFFFFF', marginBottom: '15px', lineHeight: '1.2' }}>
            {article.title}
          </h1>
          {article.subtitle && (
            <h2 style={{ fontSize: '1.4rem', color: '#AAAAAA', fontWeight: 'normal', marginBottom: '20px' }}>
              {article.subtitle}
            </h2>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: '#4DA8DA', fontSize: '1rem', fontWeight: 'bold' }}>
            <span><i className="far fa-clock" style={{ marginRight: '8px' }}></i>Reading time: {article.timeToRead || 'N/A'}</span>
          </div>
        </header>

        <img 
          src={article.imagePath ? `${API_BASE_URL}${article.imagePath}` : 'https://via.placeholder.com/800x400/1E1E1E/4DA8DA?text=No+Image'} 
          alt={article.title} 
          style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        {article.script && (
          <div style={{ color: '#FFFFFF', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '60px' }}>
            <p>{article.script}</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
          {sortedParagraphs.map((paragraph, index) => (
            <section key={paragraph.id} style={{ 
              backgroundColor: '#1E1E1E', 
              borderRadius: '16px', 
              overflow: 'hidden',
              border: '1px solid #333'
            }}>
              {paragraph.referenceImagePath && (
                <img 
                  src={`${API_BASE_URL}${paragraph.referenceImagePath}`} 
                  alt={paragraph.title || 'POI'} 
                  style={{ width: '100%', height: '300px', objectFit: 'cover' }} 
                />
              )}
              <div style={{ padding: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                  <span style={{ backgroundColor: '#4DA8DA', color: '#000', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold' }}>
                    {index + 1}
                  </span>
                  <h3 style={{ fontSize: '2rem', color: '#FFFFFF', margin: 0 }}>{paragraph.title}</h3>
                </div>
                {paragraph.subtitle && (
                  <h4 style={{ color: '#4DA8DA', fontSize: '1.1rem', marginBottom: '20px', marginLeft: '45px' }}>
                    {paragraph.subtitle}
                  </h4>
                )}
                {paragraph.script && (
                  <p style={{ color: '#CCCCCC', fontSize: '1.05rem', lineHeight: '1.7', marginLeft: '45px', marginBottom: '25px' }}>
                    {paragraph.script}
                  </p>
                )}
              </div>
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}

export default ArticleDetail;