import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'https://localhost:7097';
const MEDIA_BASE_URL = 'https://eppoi.io'; 

function EventsDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const token = localStorage.getItem('token'); 

        const response = await fetch(`${API_BASE_URL}/api/Events/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          throw new Error("Evento non trovato.");
        }
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        console.error("Errore caricamento dettaglio evento:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetail();
    }
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Caricamento...</div>;
  if (error) return <div style={{ color: '#ef5350', textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>{error}</div>;
  if (!event) return null;

  // L'immagine può trovarsi nell'evento o (come fallback) nell'organizzatore
  const displayImage = event.primaryImagePath
    ? `${MEDIA_BASE_URL}${event.primaryImagePath}`
    : event.organizer?.primaryImagePath 
    ? `${MEDIA_BASE_URL}${event.organizer.primaryImagePath}` 
    : 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&q=80';

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/EventsList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Events
      </Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {event.typology && (
              <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {event.typology}
              </span>
            )}
            {event.audience && (
              <span style={{ backgroundColor: '#332b1a', color: '#f5b041', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem' }}>
                <i className="fas fa-users" style={{ marginRight: '6px' }}></i>{event.audience}
              </span>
            )}
          </div>
          
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '15px', lineHeight: '1.1' }}>
            {event.title}
          </h1>
          
          {(event.startDate || event.endDate) && (
            <h2 style={{ fontSize: '1.5rem', color: '#4DA8DA', fontWeight: 'normal', marginBottom: '20px' }}>
              <i className="far fa-calendar-alt" style={{ marginRight: '10px' }}></i>
              {event.startDate === event.endDate 
                ? event.startDate 
                : `${event.startDate || ''} — ${event.endDate || ''}`}
            </h2>
          )}
        </header>

        <img 
          src={displayImage} 
          alt={event.title} 
          style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        {/* Sezione Organizzatore */}
        {event.organizer && (
          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333', marginBottom: '40px' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Organizer Information</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2' }}>
              <li><i className="fas fa-building" style={{ color: '#4DA8DA', width: '25px' }}></i> <strong>{event.organizer.legalName}</strong></li>
              {event.organizer.email && <li><i className="fas fa-envelope" style={{ color: '#4DA8DA', width: '25px' }}></i> {event.organizer.email}</li>}
              {event.organizer.telephone && <li><i className="fas fa-phone" style={{ color: '#4DA8DA', width: '25px' }}></i> {event.organizer.telephone}</li>}
              {event.organizer.website && <li><i className="fas fa-globe" style={{ color: '#4DA8DA', width: '25px' }}></i> <a href={event.organizer.website} style={{ color: '#4DA8DA', textDecoration: 'none' }} target="_blank" rel="noreferrer">Website</a></li>}
            </ul>
          </section>
        )}

        {/* Sezione Offerte/Biglietti */}
        {event.offers && event.offers.length > 0 && (
          <section style={{ backgroundColor: '#2A2A2A', padding: '30px', borderRadius: '12px', border: '1px solid #4DA8DA' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Tickets & Offers</h3>
            {event.offers.map(offer => (
              <div key={offer.id} style={{ borderBottom: '1px solid #444', paddingBottom: '15px', marginBottom: '15px' }}>
                <h4 style={{ color: '#f5b041', margin: '0 0 10px 0', fontSize: '1.2rem' }}>
                  {offer.ticketDescription || "Standard Ticket"}
                </h4>
                {offer.priceSpecificationCurrencyValue && (
                  <p style={{ color: '#FFFFFF', fontSize: '1.1rem', margin: '0 0 5px 0' }}>
                    Price: <strong>{offer.priceSpecificationCurrencyValue} {offer.currency}</strong>
                  </p>
                )}
                {offer.description && <p style={{ color: '#AAAAAA', fontSize: '0.95rem', margin: 0 }}>{offer.description}</p>}
              </div>
            ))}
          </section>
        )}
      </article>
    </div>
  );
}

export default EventsDetail;