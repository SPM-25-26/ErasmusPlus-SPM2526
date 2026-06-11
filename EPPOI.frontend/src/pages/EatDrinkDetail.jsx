import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyEatDrink } from './EatDrinkList';

function EatDrinkDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const foundPlace = dummyEatDrink.find(p => p.id === id);
    setPlace(foundPlace);
  }, [id]);

  if (!place) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/EatDrinkList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Eat & Drink
      </Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {place.type}
            </span>
            {place.dietaryNeeds.map((need, idx) => (
              <span key={idx} style={{ backgroundColor: '#1A3320', color: '#81C784', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid #2E7D32' }}>
                <i className="fas fa-leaf" style={{ marginRight: '6px' }}></i>{need}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '15px', lineHeight: '1.1' }}>
            {place.name}
          </h1>
        </header>

        <img 
          src={place.imagePath} 
          alt={place.name} 
          style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        <div style={{ color: '#E0E0E0', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '50px' }}>
          <p>
            {place.excerpt} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
            ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        {}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Info & Hours</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2' }}>
              <li><i className="fas fa-map-marker-alt" style={{ color: '#4DA8DA', width: '25px' }}></i> 42 Culinary Avenue, City</li>
              <li><i className="far fa-clock" style={{ color: '#4DA8DA', width: '25px' }}></i> {place.openingHours}</li>
              {}
              {place.temporaryClosureId && (
                <li style={{ color: '#ef5350', marginTop: '10px', fontWeight: 'bold' }}>
                  <i className="fas fa-exclamation-circle" style={{ width: '25px' }}></i> Temporarily Closed
                </li>
              )}
            </ul>
          </section>

          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Contact & Booking</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2' }}>
              <li><i className="fas fa-phone" style={{ color: '#4DA8DA', width: '25px' }}></i> +39 333 444 5555</li>
              <li><i className="fas fa-globe" style={{ color: '#4DA8DA', width: '25px' }}></i> www.example-restaurant.it</li>
              <li><i className="fab fa-instagram" style={{ color: '#4DA8DA', width: '25px' }}></i> @example_food</li>
            </ul>
            <button style={{ 
              marginTop: '20px', 
              width: '100%', 
              padding: '12px', 
              backgroundColor: '#4DA8DA', 
              color: '#000', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              fontSize: '1rem'
            }}>
              View Full Menu
            </button>
          </section>

        </div>
      </article>
    </div>
  );
}

export default EatDrinkDetail;