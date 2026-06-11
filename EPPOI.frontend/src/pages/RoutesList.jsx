import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const dummyRoutes = [
  {
    id: "4231cb1d-b700-4ed2-baf9-9bbe284038e1",
    name: "Example Itinerary Name",
    pathTheme: "Naturalistic", 
    travellingMethod: "By Bicycle", 
    routeLength: "25", 
    duration: "2 hours", 
    securityLevel: "Medium",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    imagePath: "https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=800&q=80"
  },
  {
    id: "demo-route-2",
    name: "Historical Village Trail",
    pathTheme: "Historical",
    travellingMethod: "Walking",
    routeLength: "8",
    duration: "3 hours",
    securityLevel: "Low",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    imagePath: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80"
  }
];

function RoutesList() {
  const [routes, setRoutes] = useState(dummyRoutes);

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
              src={route.imagePath} 
              alt={route.name} 
              style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {route.pathTheme}
                </span>
                <span style={{ backgroundColor: '#2A2A2A', color: '#FFFFFF', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                  <i className="fas fa-bicycle" style={{ marginRight: '5px' }}></i>{route.travellingMethod}
                </span>
              </div>

              <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '1.4rem', lineHeight: '1.3' }}>
                {route.name}
              </h3>
              
              <div style={{ display: 'flex', gap: '15px', color: '#AAAAAA', fontSize: '0.9rem', marginTop: '10px', marginBottom: '15px' }}>
                <span><i className="fas fa-route" style={{ color: '#4DA8DA', marginRight: '5px' }}></i>{route.routeLength} km</span>
                <span><i className="far fa-clock" style={{ color: '#4DA8DA', marginRight: '5px' }}></i>{route.duration}</span>
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