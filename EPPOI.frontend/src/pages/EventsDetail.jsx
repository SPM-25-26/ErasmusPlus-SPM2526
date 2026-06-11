import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyEvents } from './EventsList';

function EventsDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const foundEvent = dummyEvents.find(e => e.id === id);
    setEvent(foundEvent);
  }, [id]);

  if (!event) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/EventsList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Events
      </Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {event.typology}
            </span>
            <span style={{ backgroundColor: '#332b1a', color: '#f5b041', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem' }}>
              <i className="fas fa-users" style={{ marginRight: '6px' }}></i>{event.audience}
            </span>
          </div>
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '15px', lineHeight: '1.1' }}>
            {event.title}
          </h1>
          <h2 style={{ fontSize: '1.5rem', color: '#4DA8DA', fontWeight: 'normal', marginBottom: '20px' }}>
            <i className="far fa-calendar-alt" style={{ marginRight: '10px' }}></i>
            {event.startDate === event.endDate 
              ? event.startDate 
              : `${event.startDate} — ${event.endDate}`}
          </h2>
        </header>

        <img 
          src={event.imagePath} 
          alt={event.title} 
          style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        <div style={{ color: '#E0E0E0', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '50px' }}>
          <p>
            {event.excerpt} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nullam quis risus eget urna mollis ornare vel eu leo. Curabitur blandit tempus porttitor.
          </p>
        </div>

        <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Event Information</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2' }}>
            <li><i className="fas fa-map-marker-alt" style={{ color: '#4DA8DA', width: '25px' }}></i> City Main Square</li>
            <li><i className="fas fa-users" style={{ color: '#4DA8DA', width: '25px' }}></i> Recommended for: <strong>{event.audience}</strong></li>
            <li><i className="fas fa-id-badge" style={{ color: '#4DA8DA', width: '25px' }}></i> Organizer Tax Code: {event.organizerTaxCode}</li>
            <li><i className="fas fa-ticket-alt" style={{ color: '#4DA8DA', width: '25px' }}></i> Free Entry</li>
          </ul>
        </section>
      </article>
    </div>
  );
}

export default EventsDetail;