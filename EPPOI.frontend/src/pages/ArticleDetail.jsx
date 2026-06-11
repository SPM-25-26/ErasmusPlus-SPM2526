import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyArticles } from './ArticlesList'; 

function ArticleDetail() {
  const { id } = useParams(); 
  const [article, setArticle] = useState(null);

  useEffect(() => {
    
    const foundArticle = dummyArticles.find(a => a.id === id);
    setArticle(foundArticle);
  }, [id]);

  if (!article) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  const sortedParagraphs = [...(article.paragraphs || [])].sort((a, b) => a.position - b.position);

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
          <h2 style={{ fontSize: '1.4rem', color: '#AAAAAA', fontWeight: 'normal', marginBottom: '20px' }}>
            {article.subtitle}
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', color: '#4DA8DA', fontSize: '1rem', fontWeight: 'bold' }}>
            <span><i className="far fa-clock" style={{ marginRight: '8px' }}></i>Reading time: {article.timeToRead}</span>
          </div>
        </header>

        <img 
          src={article.imagePath} 
          alt="Main Article" 
          style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        <div style={{ color: '#FFFFFF', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '60px' }}>
          <p>{article.script}</p>
        </div>

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
                  src={paragraph.referenceImagePath} 
                  alt="Paragraph visual" 
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
                <h4 style={{ color: '#4DA8DA', fontSize: '1.1rem', marginBottom: '20px', marginLeft: '45px' }}>
                  {paragraph.subtitle}
                </h4>
                <p style={{ color: '#CCCCCC', fontSize: '1.05rem', lineHeight: '1.7', marginLeft: '45px', marginBottom: '25px' }}>
                  {paragraph.script}
                </p>
                
                {paragraph.referenceName && (
                  <div style={{ marginLeft: '45px', padding: '15px', backgroundColor: '#2A2A2A', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#4DA8DA' }}></i>
                    <span style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>Point of Interest: <strong>{paragraph.referenceName}</strong></span>
                  </div>
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