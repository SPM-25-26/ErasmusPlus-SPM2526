import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'https://localhost:7097';

function RoutesDetail() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRouteDetail = async () => {
      try {
        const token = localStorage.getItem('token'); 

        const response = await fetch(`${API_BASE_URL}/api/Routes/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          throw new Error("Itinerario non trovato.");
        }
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setRoute(data);
      } catch (err) {
        console.error("Errore caricamento dettaglio Route:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRouteDetail();
    }
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Caricamento...</div>;
  if (error) return <div style={{ color: '#ef5350', textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>{error}</div>;
  if (!route) return null;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/RoutesList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Routes
      </Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {route.pathTheme && (
              <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {route.pathTheme}
              </span>
            )}
            {route.travellingMethod && (
              <span style={{ backgroundColor: '#2A2A2A', color: '#FFFFFF', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem' }}>
                {route.travellingMethod}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '15px', lineHeight: '1.1' }}>
            {route.name}
          </h1>
        </header>

        <img 
          src={route.imagePath ? `${API_BASE_URL}${route.imagePath}` : 'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=800&q=80'} 
          alt={route.name} 
          style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        {route.description && (
          <div style={{ color: '#E0E0E0', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '50px' }}>
            <p>{route.description}</p>
          </div>
        )}

        {/* Box Specifiche Tecniche del Percorso */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
          
          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Technical Specs</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2.2' }}>
              {route.routeLength && <li><i className="fas fa-arrows-alt-h" style={{ color: '#4DA8DA', width: '25px' }}></i> Distance: <strong>{route.routeLength} km</strong></li>}
              {route.duration && <li><i className="far fa-clock" style={{ color: '#4DA8DA', width: '25px' }}></i> Estimated Time: <strong>{route.duration}</strong></li>}
              {route.securityLevel && <li><i className="fas fa-shield-alt" style={{ color: '#4DA8DA', width: '25px' }}></i> Difficulty: <strong>{route.securityLevel}</strong></li>}
              {route.startPointAddress && <li><i className="fas fa-map-pin" style={{ color: '#4DA8DA', width: '25px' }}></i> Start: {route.startPointAddress}</li>}
            </ul>
          </section>

          {/* Info Organizzatore (mostrato solo se c'è almeno un dato) */}
          {(route.orgEmail || route.orgTelephone || route.orgWebsite) && (
            <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Organization Info</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2.2' }}>
                {route.orgEmail && <li><i className="fas fa-envelope" style={{ color: '#4DA8DA', width: '25px' }}></i> {route.orgEmail}</li>}
                {route.orgTelephone && <li><i className="fas fa-phone" style={{ color: '#4DA8DA', width: '25px' }}></i> {route.orgTelephone}</li>}
                {route.orgWebsite && <li><i className="fas fa-globe" style={{ color: '#4DA8DA', width: '25px' }}></i> <a href={route.orgWebsite} target="_blank" rel="noreferrer" style={{ color: '#4DA8DA', textDecoration: 'none' }}>Website</a></li>}
              </ul>
            </section>
          )}
        </div>

        {/* Tappe dell'Itinerario */}
        {route.routeStages && route.routeStages.length > 0 && (
          <section>
            <h3 style={{ color: '#FFFFFF', fontSize: '2rem', marginBottom: '30px' }}>Itinerary Stages</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {route.routeStages.map((stage) => (
                <div key={stage.id} style={{ display: 'flex', gap: '20px', backgroundColor: '#1E1E1E', padding: '25px', borderRadius: '12px', borderLeft: '4px solid #4DA8DA' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4DA8DA', minWidth: '40px' }}>
                    {stage.number}
                  </div>
                  <div>
                    <h4 style={{ color: '#FFFFFF', fontSize: '1.3rem', margin: '0 0 10px 0' }}>
                      {stage.name || stage.poiName || `Stage ${stage.number}`}
                    </h4>
                    {stage.description && <p style={{ color: '#AAAAAA', margin: '0 0 10px 0', lineHeight: '1.5' }}>{stage.description}</p>}
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {stage.category && <span style={{ fontSize: '0.8rem', color: '#f5b041', backgroundColor: '#332b1a', padding: '3px 8px', borderRadius: '4px' }}>{stage.category}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </article>
    </div>
  );
}

export default RoutesDetail;