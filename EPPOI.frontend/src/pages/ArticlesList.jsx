import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const dummyArticles = [
  {
    id: "demo-1",
    title: "Example Article Title",
    subtitle: "A short placeholder subtitle for the layout",
    script: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    timeToRead: "5 minutes",
    imagePath: "https://via.placeholder.com/800x400/1E1E1E/4DA8DA?text=Article+Image",
    paragraphs: [
      {
        id: "p1",
        position: 1,
        title: "First Paragraph POI",
        subtitle: "Subtitle for the first point of interest",
        script: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in venenatis enim. Mauris facilisis justo at tellus gravida.",
        referenceName: "Example POI Name",
        referenceCategory: "ArtCulture",
        referenceImagePath: "https://via.placeholder.com/800x400/2A2A2A/FFFFFF?text=POI+Image+1"
      },
      {
        id: "p2",
        position: 2,
        title: "Second Paragraph POI",
        subtitle: "Subtitle for the second point of interest",
        script: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
        referenceName: "Another Example POI",
        referenceCategory: "Nature",
        referenceImagePath: "https://via.placeholder.com/800x400/2A2A2A/FFFFFF?text=POI+Image+2"
      }
    ]
  },
  {
    id: "demo-2",
    title: "Second Dummy Article",
    subtitle: "Another placeholder for the grid",
    script: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    timeToRead: "3 minutes",
    imagePath: "https://via.placeholder.com/800x400/1E1E1E/4DA8DA?text=Article+Image+2",
    paragraphs: []
  }
];

function ArticlesList() {
  const [articles, setArticles] = useState(dummyArticles);

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>

      <Link to="/home" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Home
      </Link>

      <header style={{ marginBottom: '50px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginBottom: '15px' }}>Articles</h1>
        <p style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>Placeholder description for the articles section.</p>
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
            <img 
              src={article.imagePath} 
              alt="placeholder" 
              style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ color: '#4DA8DA', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="far fa-clock"></i> {article.timeToRead}
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