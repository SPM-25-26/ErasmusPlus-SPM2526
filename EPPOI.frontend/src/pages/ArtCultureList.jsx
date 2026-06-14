import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://localhost:7097';
const MUNICIPALITY_ID = '6c44abbd-72f1-4906-b22a-467cc97cf7b6';

function ArtCultureList() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const token = localStorage.getItem('token'); 

        // Attenzione alla rotta corretta: api/pois/culture
        const response = await fetch(`${API_BASE_URL}/api/pois/culture?municipalityId=${MUNICIPALITY_ID}`, {
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
        setPlaces(data);
      } catch (err) {
        console.error("Errore nel caricamento Art & Culture:", err);
        setError("Impossibile caricare i luoghi. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>Caricamento in corso...</div>;
  if (error) return <div style={{ color: '#ef5350', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>{error}</div>;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>

      <Link to="/home" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Home
      </Link>
      
      <header style={{ marginBottom: '50px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginBottom: '15px' }}>Art & Culture</h1>
        <p style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>Discover museums, cinemas, and historical sites.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '40px' 
      }}>
        {places.map((place) => (
          <Link to={`/ArtCultureDetail/${place.id}`} key={place.id} style={{ 
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
              src={place.primaryImagePath ? `${API_BASE_URL}${place.primaryImagePath}` : 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80'} 
              alt={place.officialName} 
              style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
                {place.type && (
                  <span style={{ 
                    backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '4px 10px', 
                    borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase'
                  }}>
                    {place.type}
                  </span>
                )}
                {place.subjectDiscipline && (
                  <span style={{ 
                    backgroundColor: '#2A2A2A', color: '#AAAAAA', padding: '4px 10px', 
                    borderRadius: '20px', fontSize: '0.8rem'
                  }}>
                    {place.subjectDiscipline}
                  </span>
                )}
              </div>
              
              {/* Nota: si usa officialName invece di name */}
              <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '1.4rem', lineHeight: '1.3' }}>
                {place.officialName}
              </h3>
              
              {place.address && (
                <div style={{ color: '#AAAAAA', fontSize: '0.85rem', marginBottom: '15px' }}>
                  <i className="fas fa-map-marker-alt" style={{ marginRight: '5px', color: '#4DA8DA' }}></i>
                  {place.address}
                </div>
              )}

              <div style={{ color: '#4DA8DA', fontWeight: 'bold', fontSize: '0.9rem', marginTop: 'auto' }}>
                View Details &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ArtCultureList;