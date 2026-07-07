import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const MEDIA_BASE_URL = 'https://eppoi.io';
const MUNICIPALITY_ID = '6c44abbd-72f1-4906-b22a-467cc97cf7b6';

function NatureList() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNature = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/pois/culture?municipalityId=${MUNICIPALITY_ID}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setPlaces(data.filter(p => p.artCultureNatureType === 'Nature'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNature();
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '100px', textAlign: 'center' }}>Caricamento...</div>;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <Link to="/home" style={{ color: '#4DA8DA', textDecoration: 'none', marginBottom: '30px', display: 'inline-block' }}>&larr; Back to Home</Link>
      <header style={{ marginBottom: '50px' }}>
        <h1 style={{ color: '#FFFFFF', fontSize: '2.8rem' }}>Nature & Green Areas</h1>
        <p style={{ color: '#AAAAAA' }}>Discover parks, reserves, and outdoor spots.</p>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
        {places.map((place) => (
          <Link to={`/NatureDetail/${place.id}`} key={place.id} style={{ textDecoration: 'none', backgroundColor: '#1E1E1E', borderRadius: '12px', overflow: 'hidden' }}>
            <img src={place.primaryImagePath ? `${MEDIA_BASE_URL}${place.primaryImagePath}` : 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800'} alt={place.officialName} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
            <div style={{ padding: '20px' }}>
              <h3 style={{ color: '#FFFFFF' }}>{place.officialName}</h3>
              <div style={{ color: '#4DA8DA', marginTop: '10px' }}>Explore &rarr;</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default NatureList;