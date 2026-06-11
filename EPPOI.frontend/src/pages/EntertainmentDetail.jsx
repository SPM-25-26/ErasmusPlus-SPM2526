import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyEntertainment } from './EntertainmentList';

function EntertainmentDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const foundPlace = dummyEntertainment.find(p => p.id === id);
    setPlace(foundPlace);
  }, [id]);

  if (!place) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/EntertainmentList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Entertainment
      </Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {place.category}
            </span>
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
            {place.excerpt} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel accumsan magna. 
            Fusce tincidunt nisl id facilisis cursus. Pellentesque habitant morbi tristique senectus et netus 
            et malesuada fames ac turpis egestas.
          </p>
        </div>

        <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Visitor Information</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2' }}>
            <li><i className="fas fa-map-marker-alt" style={{ color: '#4DA8DA', width: '25px' }}></i> 99 Leisure Blvd, City</li>
            <li><i className="far fa-clock" style={{ color: '#4DA8DA', width: '25px' }}></i> Open Daily: 2:00 PM - 2:00 AM</li>
            <li><i className="fas fa-ticket-alt" style={{ color: '#4DA8DA', width: '25px' }}></i> Entry fee required</li>
            <li><i className="fas fa-phone" style={{ color: '#4DA8DA', width: '25px' }}></i> +39 555 888 9999</li>
          </ul>
        </section>
      </article>
    </div>
  );
}

export default EntertainmentDetail;