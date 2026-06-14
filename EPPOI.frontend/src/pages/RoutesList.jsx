import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'https://localhost:7097';
const MUNICIPALITY_ID = '6c44abbd-72f1-4906-b22a-467cc97cf7b6';

function RoutesList() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const token = localStorage.getItem('token'); 

        const response = await fetch(`${API_BASE_URL}/api/Routes?municipalityId=${MUNICIPALITY_ID}`, {
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
        setRoutes(data);
      } catch (err) {
        console.error("Errore nel caricamento Routes:", err);
        setError("Impossibile caricare gli itinerari. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>Caricamento itinerari...</div>;
  if (error) return <div style={{ color: '#ef5350', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>{error}</div>;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      
      <Link to="/home" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Home
      </Link>

      <header style={{ marginBottom: '50px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginBottom: '15px' }}>Itineraries & Routes</h1>
        <p style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>Explore the territory through specialized trails and paths.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '40px' 
      }}>
        {routes.map((route) => (
          <Link to={`/RoutesDetail/${route.id}`} key={route.id} style={{ 
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
              src={route.imagePath ? `${API_BASE_URL}${route.imagePath}` : 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=800&q=80'} 
              alt={route.name} 
              style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                {route.pathTheme && (
                  <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {route.pathTheme}
                  </span>
                )}
                {route.travellingMethod && (
                  <span style={{ backgroundColor: '#2A2A2A', color: '#FFFFFF', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                    <i className="fas fa-bicycle" style={{ marginRight: '5px' }}></i>{route.travellingMethod}
                  </span>
                )}
              </div>

              <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '1.4rem', lineHeight: '1.3' }}>
                {route.name}
              </h3>
              
              <div style={{ display: 'flex', gap: '15px', color: '#AAAAAA', fontSize: '0.9rem', marginTop: '10px', marginBottom: '15px' }}>
                {route.routeLength && <span><i className="fas fa-route" style={{ color: '#4DA8DA', marginRight: '5px' }}></i>{route.routeLength} km</span>}
                {route.duration && <span><i className="far fa-clock" style={{ color: '#4DA8DA', marginRight: '5px' }}></i>{route.duration}</span>}
              </div>

              <div style={{ color: '#4DA8DA', fontWeight: 'bold', fontSize: '0.9rem', marginTop: 'auto', textAlign: 'right' }}>
                View Route &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default RoutesList;