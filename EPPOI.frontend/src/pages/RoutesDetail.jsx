import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyRoutes } from './RoutesList';

function RoutesDetail() {
  const { id } = useParams();
  const [route, setRoute] = useState(null);

  useEffect(() => {
    const foundRoute = dummyRoutes.find(r => r.id === id);
    setRoute(foundRoute);
  }, [id]);

  if (!route) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/RoutesList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Routes
      </Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
              {route.pathTheme}
            </span>
            <span style={{ backgroundColor: '#2A2A2A', color: '#FFFFFF', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem' }}>
              {route.travellingMethod}
            </span>
          </div>
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '15px', lineHeight: '1.1' }}>
            {route.name}
          </h1>
        </header>

        <img 
          src={route.imagePath} 
          alt={route.name} 
          style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        <div style={{ color: '#E0E0E0', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '50px' }}>
          <p>{route.description}</p>
        </div>

        {/* Box Specifiche Tecniche del Percorso */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Technical Specs</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2.2' }}>
              <li><i className="fas fa-arrows-alt-h" style={{ color: '#4DA8DA', width: '25px' }}></i> Distance: <strong>{route.routeLength} km</strong></li>
              <li><i className="far fa-clock" style={{ color: '#4DA8DA', width: '25px' }}></i> Estimated Time: <strong>{route.duration}</strong></li>
              <li><i className="fas fa-shield-alt" style={{ color: '#4DA8DA', width: '25px' }}></i> Difficulty Level: <strong>{route.securityLevel}</strong></li>
              <li><i className="fas fa-map-pin" style={{ color: '#4DA8DA', width: '25px' }}></i> Start: Placeholder Address</li>
            </ul>
          </section>

          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Organization Info</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2.2' }}>
              <li><i className="fas fa-envelope" style={{ color: '#4DA8DA', width: '25px' }}></i> org@example.com</li>
              <li><i className="fas fa-phone" style={{ color: '#4DA8DA', width: '25px' }}></i> +39 000 000000</li>
              <li><i className="fas fa-globe" style={{ color: '#4DA8DA', width: '25px' }}></i> Official Website</li>
            </ul>
          </section>

        </div>
      </article>
    </div>
  );
}

export default RoutesDetail;