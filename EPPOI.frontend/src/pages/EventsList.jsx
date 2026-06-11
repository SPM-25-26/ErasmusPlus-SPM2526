import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const dummyEvents = [
  {
    id: "002f4352-9f41-4bad-9e38-bcc5666e9f34",
    title: "Sagra degli Gnocchi ai Frutti di Mare", 
    typology: "Food Festival", 
    audience: "Adults & Children", 
    startDate: "2025-08-22",
    endDate: "2025-08-24",
    organizerTaxCode: "00356330449",
    excerpt: "Three days of amazing local seafood, live music, and traditional dances in the city square.",
    imagePath: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"
  },
  {
    id: "demo-event-2",
    title: "Symphony Under the Stars",
    typology: "Concert",
    audience: "All Ages",
    startDate: "2025-07-15",
    endDate: "2025-07-15",
    organizerTaxCode: "11223344556",
    excerpt: "The local orchestra performs classical masterpieces in the magical setting of the archaeological park.",
    imagePath: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&q=80"
  },
  {
    id: "demo-event-3",
    title: "Contemporary Art Fair",
    typology: "Exhibition",
    audience: "Adults",
    startDate: "2025-09-01",
    endDate: "2025-09-10",
    organizerTaxCode: "99887766554",
    excerpt: "Discover emerging artists and modern installations spread across the historic center.",
    imagePath: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80"
  }
];

function EventsList() {
  const [events, setEvents] = useState(dummyEvents);

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
                src={event.imagePath} 
                alt={event.title} 
                style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
              />
              {}
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
                {event.startDate === event.endDate ? event.startDate : `${event.startDate} to ${event.endDate}`}
              </div>
            </div>

            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {event.typology}
                </span>
                <span style={{ backgroundColor: '#332b1a', color: '#f5b041', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                  <i className="fas fa-users" style={{ marginRight: '5px' }}></i>{event.audience}
                </span>
              </div>

              <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '1.4rem', lineHeight: '1.3' }}>
                {event.title}
              </h3>
              <p style={{ color: '#AAAAAA', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px 0', flexGrow: 1 }}>
                {event.excerpt}
              </p>
              
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