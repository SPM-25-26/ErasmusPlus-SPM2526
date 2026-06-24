import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://localhost:7097';
const MEDIA_BASE_URL = 'https://eppoi.io'; // Aggiunta la base url per i media
const MUNICIPALITY_ID = '6c44abbd-72f1-4906-b22a-467cc97cf7b6';

function EntertainmentList() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntertainment = async () => {
      try {
        const token = localStorage.getItem('token'); 

        // Rotta specifica per l'intrattenimento
        const response = await fetch(`${API_BASE_URL}/api/pois/entertainment?municipalityId=${MUNICIPALITY_ID}`, {
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
        console.error("Errore nel caricamento Entertainment:", err);
        setError("Impossibile caricare le attività. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    fetchEntertainment();
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>Caricamento in corso...</div>;
  if (error) return <div style={{ color: '#ef5350', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>{error}</div>;

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
              src={place.primaryImagePath ? `${MEDIA_BASE_URL}${place.primaryImagePath}` : 'https://images.unsplash.com/photo-1511516284004-944208a0980d?w=800&q=80'} 
              alt={place.officialName} 
              style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              
              <div style={{ display: 'flex', marginBottom: '15px' }}>
                {place.category && (
                  <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {place.category}
                  </span>
                )}
              </div>

              <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '1.4rem', lineHeight: '1.3' }}>
                {place.officialName}
              </h3>
              
              {/* Il summary DTO non ha la descrizione, ma ha l'indirizzo */}
              {place.address && (
                <p style={{ color: '#AAAAAA', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px 0', flexGrow: 1 }}>
                  <i className="fas fa-map-marker-alt" style={{ marginRight: '5px' }}></i> {place.address}
                </p>
              )}
              
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