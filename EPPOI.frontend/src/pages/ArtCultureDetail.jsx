import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'https://localhost:7097';
const MEDIA_BASE_URL = 'https://eppoi.io';

function ArtCultureDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        const token = localStorage.getItem('token'); 

        const response = await fetch(`${API_BASE_URL}/api/pois/culture/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          throw new Error("Luogo non trovato.");
        }
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setPlace(data);
      } catch (err) {
        console.error("Errore caricamento dettaglio:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPlaceDetail();
    }
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Caricamento...</div>;
  if (error) return <div style={{ color: '#ef5350', textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>{error}</div>;
  if (!place) return null;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/ArtCultureList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Art & Culture
      </Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {place.type && (
              <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {place.type}
              </span>
            )}
            {place.subjectDiscipline && (
              <span style={{ backgroundColor: '#2A2A2A', color: '#AAAAAA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem' }}>
                {place.subjectDiscipline}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '20px', lineHeight: '1.1' }}>
            {place.officialName}
          </h1>
        </header>

        <img 
          src={place.primaryImagePath ? `${MEDIA_BASE_URL}${place.primaryImagePath}` : 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&q=80'} 
          alt={place.officialName} 
          style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        {place.description && (
          <div style={{ color: '#E0E0E0', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '50px' }}>
            <p>{place.description}</p>
          </div>
        )}

        {(place.address || place.telephone || place.email || place.website) && (
          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Visitor Information</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2' }}>
              {place.address && (
                <li><i className="fas fa-map-marker-alt" style={{ color: '#4DA8DA', width: '25px' }}></i> {place.address}</li>
              )}
              {place.telephone && (
                <li><i className="fas fa-phone" style={{ color: '#4DA8DA', width: '25px' }}></i> {place.telephone}</li>
              )}
              {place.email && (
                <li><i className="fas fa-envelope" style={{ color: '#4DA8DA', width: '25px' }}></i> {place.email}</li>
              )}
              {place.website && (
                <li><i className="fas fa-globe" style={{ color: '#4DA8DA', width: '25px' }}></i> <a href={place.website} target="_blank" rel="noreferrer" style={{ color: '#4DA8DA', textDecoration: 'none' }}>Website</a></li>
              )}
              
              {(place.facebook || place.instagram) && (
                <li style={{ marginTop: '15px' }}>
                  {place.instagram && (
                    <a href={place.instagram} target="_blank" rel="noreferrer" style={{ marginRight: '15px' }}>
                      <i className="fab fa-instagram" style={{ color: '#E1306C', fontSize: '1.5rem' }}></i>
                    </a>
                  )}
                  {place.facebook && (
                    <a href={place.facebook} target="_blank" rel="noreferrer">
                      <i className="fab fa-facebook" style={{ color: '#1877F2', fontSize: '1.5rem' }}></i>
                    </a>
                  )}
                </li>
              )}
            </ul>
          </section>
        )}
      </article>
    </div>
  );
}

export default ArtCultureDetail;