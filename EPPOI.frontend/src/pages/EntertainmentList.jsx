import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const dummyEntertainment = [
  {
    id: "214a80f3-3cfc-4eff-aaeb-5e8e0521ec97",
    name: "City Bowling Alley",
    category: "Leisure Sector", // Traduzione per il frontend del tuo 'Settore Svago'
    excerpt: "Modern bowling alley with 12 lanes, arcade games, and a snack bar for a fun night out.",
    imagePath: "https://images.unsplash.com/photo-1511516284004-944208a0980d?w=800&q=80"
  },
  {
    id: "demo-ent-2",
    name: "Escape Room Experience",
    category: "Interactive Games",
    excerpt: "Challenge your mind and escape before the time runs out. 3 different themed rooms available.",
    imagePath: "https://images.unsplash.com/photo-1518712959635-c33cc17f5ea5?w=800&q=80"
  },
  {
    id: "demo-ent-3",
    name: "Summer Open-Air Cinema",
    category: "Entertainment",
    excerpt: "Watch the latest blockbusters under the stars during the warm summer evenings.",
    imagePath: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80"
  }
];

function EntertainmentList() {
  const [places, setPlaces] = useState(dummyEntertainment);

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      
      <Link to="/home" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Home
      </Link>

      <header style={{ marginBottom: '50px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginBottom: '15px' }}>Entertainment</h1>
        <p style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>Find the best activities, games, and leisure spots in the city.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '40px' 
      }}>
        {places.map((place) => (
          <Link to={`/EntertainmentDetail/${place.id}`} key={place.id} style={{ 
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
              src={place.imagePath} 
              alt={place.name} 
              style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              
              <div style={{ display: 'flex', marginBottom: '15px' }}>
                <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {place.category}
                </span>
              </div>

              <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '1.4rem', lineHeight: '1.3' }}>
                {place.name}
              </h3>
              <p style={{ color: '#AAAAAA', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px 0', flexGrow: 1 }}>
                {place.excerpt}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                <span style={{ color: '#4DA8DA', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Discover &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default EntertainmentList;