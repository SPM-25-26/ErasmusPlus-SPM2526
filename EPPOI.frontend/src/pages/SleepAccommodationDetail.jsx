import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyAccommodations } from './SleepAccommodationList';

function SleepAccommodationDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const foundPlace = dummyAccommodations.find(p => p.id === id);
    setPlace(foundPlace);
  }, [id]);

  if (!place) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  const renderStars = (rating) => {
    const numStars = Math.floor(parseFloat(rating));
    return Array.from({ length: numStars }, (_, i) => (
      <i key={i} className="fas fa-star" style={{ color: '#F5B041', marginRight: '4px', fontSize: '1.2rem' }}></i>
    ));
  };

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/SleepAccommodationList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Accommodations
      </Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {place.typology}
            </span>
            <div style={{ display: 'flex' }}>
              {renderStars(place.classification)}
            </div>
          </div>
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '15px', lineHeight: '1.1' }}>
            {place.name}
          </h1>
          <div style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: '#4DA8DA' }}></i>
            {place.shortAddress}
          </div>
        </header>

        <img 
          src={place.imagePath} 
          alt={place.name} 
          style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        {}
        {place.roomTypologies && place.roomTypologies.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: '#FFFFFF', marginBottom: '12px' }}>Available Accommodations:</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {place.roomTypologies.map((room, idx) => (
                <span key={idx} style={{ backgroundColor: '#2A2A2A', color: '#E0E0E0', padding: '6px 12px', borderRadius: '6px', fontSize: '0.9rem', border: '1px solid #333' }}>
                  <i className="fas fa-bed" style={{ marginRight: '6px', color: '#4DA8DA' }}></i>{room}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ color: '#E0E0E0', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '50px' }}>
          <p>{place.excerpt} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Proin non sem sit amet magna interdum scelerisque quis vel eros.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Contact & Booking</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2.2' }}>
              <li><i className="fas fa-phone" style={{ color: '#4DA8DA', width: '25px' }}></i> +39 0735 123456</li>
              <li><i className="fas fa-envelope" style={{ color: '#4DA8DA', width: '25px' }}></i> info@exampleaccommodation.com</li>
              <li><i className="fas fa-globe" style={{ color: '#4DA8DA', width: '25px' }}></i> www.exampleaccommodation.com</li>
            </ul>
          </section>

          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <button style={{ 
              width: '100%', 
              padding: '15px', 
              backgroundColor: '#4DA8DA', 
              color: '#000', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              fontSize: '1.1rem'
            }}>
              Check Availability
            </button>
          </section>
        </div>

      </article>
    </div>
  );
}

export default SleepAccommodationDetail;