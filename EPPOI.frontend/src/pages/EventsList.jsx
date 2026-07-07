import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const MEDIA_BASE_URL = 'https://eppoi.io'; 
const MUNICIPALITY_ID = '6c44abbd-72f1-4906-b22a-467cc97cf7b6'; 

function EventsList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token'); 

        const response = await fetch(`${API_BASE_URL}/api/Events?municipalityId=${MUNICIPALITY_ID}`, {
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
        setEvents(data);
      } catch (err) {
        console.error("Errore nel caricamento degli eventi:", err);
        setError("Impossibile caricare gli eventi. Riprova più tardi.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>Caricamento eventi in corso...</div>;
  if (error) return <div style={{ color: '#ef5350', textAlign: 'center', padding: '100px', fontSize: '1.2rem' }}>{error}</div>;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      
      <Link to="/home" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Home
      </Link>

      <header style={{ marginBottom: '50px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginBottom: '15px' }}>Events & Festivals</h1>
        <p style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>Find out what's happening in the city during your stay.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '40px' 
      }}>
        {events.map((event) => (
          <Link to={`/EventsDetail/${event.id}`} key={event.id} style={{ 
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
            <div style={{ position: 'relative' }}>
              
              <img 
                src={event.primaryImagePath ? `${MEDIA_BASE_URL}${event.primaryImagePath}` : "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80"} 
                alt={event.title} 
                style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
              />
              
              {(event.startDate || event.endDate) && (
                <div style={{ 
                  position: 'absolute', 
                  bottom: '15px', 
                  right: '15px', 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  color: '#FFFFFF', 
                  padding: '8px 12px', 
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  border: '1px solid #4DA8DA'
                }}>
                  <i className="far fa-calendar-alt" style={{ marginRight: '6px', color: '#4DA8DA' }}></i>
                  {event.startDate === event.endDate ? event.startDate : `${event.startDate || 'TBA'} - ${event.endDate || 'TBA'}`}
                </div>
              )}
            </div>

            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                {event.typology && (
                  <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {event.typology}
                  </span>
                )}
                {event.organizerName && (
                  <span style={{ backgroundColor: '#332b1a', color: '#f5b041', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                    <i className="fas fa-bullhorn" style={{ marginRight: '5px' }}></i>{event.organizerName}
                  </span>
                )}
              </div>

              <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '1.4rem', lineHeight: '1.3' }}>
                {event.title}
              </h3>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                <span style={{ color: '#4DA8DA', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Event Details &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default EventsList;