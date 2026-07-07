import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const MEDIA_BASE_URL = 'https://eppoi.io';

function NatureDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNatureDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/pois/culture/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error("Luogo naturale non trovato.");
        
        const data = await response.json();
        setPlace(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNatureDetail();
  }, [id]);

  if (loading) return <div style={{ color: 'white', padding: '50px', textAlign: 'center' }}>Caricamento...</div>;
  if (error) return <div style={{ color: '#ef5350', padding: '50px', textAlign: 'center' }}>{error}</div>;
  if (!place) return null;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/nature" style={{ color: '#4DA8DA', textDecoration: 'none', marginBottom: '30px', display: 'inline-block' }}>&larr; Back to Nature</Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '15px' }}>{place.officialName}</h1>
          {place.address && (
            <div style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: '#4DA8DA' }}></i>
              {place.address}
            </div>
          )}
        </header>

        <img 
          src={place.primaryImagePath ? `${MEDIA_BASE_URL}${place.primaryImagePath}` : 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800'} 
          alt={place.officialName} 
          style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px' }} 
        />

        {place.description && (
          <div style={{ color: '#E0E0E0', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '40px' }}>
            <p>{place.description}</p>
          </div>
        )}

        <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Visit Info</h3>
          <ul style={{ listStyle: 'none', padding: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2' }}>
            {place.telephone && <li><i className="fas fa-phone" style={{ color: '#4DA8DA', width: '25px' }}></i> {place.telephone}</li>}
            {place.email && <li><i className="fas fa-envelope" style={{ color: '#4DA8DA', width: '25px' }}></i> {place.email}</li>}
            {place.website && <li><i className="fas fa-globe" style={{ color: '#4DA8DA', width: '25px' }}></i> <a href={place.website} target="_blank" rel="noreferrer" style={{ color: '#4DA8DA' }}>Website</a></li>}
          </ul>
        </section>
      </article>
    </div>
  );
}

export default NatureDetail;