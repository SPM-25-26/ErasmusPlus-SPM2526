import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const MEDIA_BASE_URL = 'https://eppoi.io';

function Home() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [events, setEvents] = useState([]); 
  
  useEffect(() => {
    const initPage = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      try {
        const statusRes = await fetch(`${API_BASE_URL}/api/UserPreferences/status`, { headers: { 'Authorization': `Bearer ${token}` } });
        const statusData = await statusRes.json();
        if (!statusData.hasCompleted) { navigate('/questionnaire'); return; }

        const feedRes = await fetch(`${API_BASE_URL}/api/UserPreferences/discover?municipalityId=6c44abbd-72f1-4906-b22a-467cc97cf7b6`, { headers: { 'Authorization': `Bearer ${token}` } });
        const dbData = await feedRes.json();
        
        setEvents(dbData);
        setIsChecking(false);
      } catch (error) { 
        console.error("Errore:", error); 
        setIsChecking(false); 
      }
    };
    initPage();
  }, [navigate]);

  const categories = [
    { title: "Articles", icon: "fa-newspaper", path: "/ArticlesList", desc: "News and updates" },
    { title: "Art & Culture", icon: "fa-palette", path: "/ArtCultureList", desc: "Museums & exhibits" },
    { title: "Eat & Drink", icon: "fa-utensils", path: "/EatDrinkList", desc: "Local flavors" },
    { title: "Entertainment", icon: "fa-ticket-alt", path: "/EntertainmentList", desc: "Leisure" },
    { title: "Events", icon: "fa-calendar-check", path: "/EventsList", desc: "This week" },
    { title: "Nature", icon: "fa-leaf", path: "/NatureList", desc: "Parks" },
    { title: "Routes", icon: "fa-route", path: "/RoutesList", desc: "Itineraries" },
    { title: "Organizations", icon: "fa-sitemap", path: "/OrganizationsList", desc: "Services" },
    { title: "Sleep Accommodation", icon: "fa-hotel", path: "/SleepAccommodationList", desc: "Where to stay" },
    { title: "Shopping", icon: "fa-shopping-bag", path: "/ShoppingList", desc: "Local products" }
  ];

  if (isChecking) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Verifica autorizzazioni...</div>;

  return (
    <div style={{ padding: '40px 5%', margin: '0 auto', fontFamily: 'inherit', maxWidth: '1600px' }}>
      
      {/* HEADER DASHBOARD */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', 
        marginBottom: '50px',
        borderBottom: '1px solid #333',
        paddingBottom: '20px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '2.5rem', letterSpacing: '-0.5px' }}>Welcome to Eppoi</h1>
          <p style={{ color: '#aaa', margin: 0, fontSize: '1.1rem' }}>Esplora, scopri e vivi il tuo territorio</p>
        </div>

        {/* BARRA AZIONI RAPIDE */}
        <div style={{ display: 'flex', gap: '15px' }}>
          {[
            { label: "Mappa", path: "/map", icon: "fa-map-marked-alt" },
            { label: "Interessi", path: "/questionnaire", icon: "fa-sliders-h" },
            { label: "Chatbot", path: "/chatbot", icon: "fa-comments" }
          ].map((item) => (
            <button 
              key={item.label} 
              onClick={() => navigate(item.path)} 
              style={{ 
                backgroundColor: '#1E1E1E', 
                border: '1px solid #333', 
                color: '#4DA8DA', 
                padding: '12px 24px', 
                borderRadius: '12px', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#4DA8DA'; e.currentTarget.style.backgroundColor = '#252525'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.backgroundColor = '#1E1E1E'; }}
            >
              <i className={`fas ${item.icon}`}></i> {item.label}
            </button>
          ))}
        </div>
      </header>

      {/* SEZIONE CONSIGLIATI: Card grandi con Scorrimento Verticale Interno */}
      <section style={{ marginBottom: '60px' }}>
        <h2 style={{ color: 'white', margin: '0 0 25px 0', fontSize: '1.5rem' }}>Consigliati per te</h2>
        
        {/* BOX SCORREVOLE */}
        <div style={{ 
          maxHeight: '500px', 
          overflowY: 'auto',  
          paddingRight: '15px', 
          paddingBottom: '10px'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '20px' 
          }}>
            {events.map(event => {
              const path = event.entityType === 'Sleep' ? `/SleepAccommodationDetail/${event.id}` : `/${event.entityType}Detail/${event.id}`;
              return (
                <Link 
                  to={path} 
                  key={event.id} 
                  style={{ 
                    textDecoration: 'none', 
                    backgroundColor: '#1E1E1E', 
                    borderRadius: '16px', 
                    border: '1px solid #333',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'border-color 0.2s ease, transform 0.2s ease'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#4DA8DA'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <img 
                    src={event.imagePath ? `${MEDIA_BASE_URL}${event.imagePath}` : "https://via.placeholder.com/300x150"} 
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderBottom: '1px solid #333' }} 
                    alt={event.title} 
                  />
                  <div style={{ padding: '20px' }}>
                    <h4 style={{ color: 'white', margin: '0 0 10px 0', fontSize: '1.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</h4>
                    {event.distanceInKm && (
                      <span style={{ color: '#4DA8DA', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fas fa-map-marker-alt"></i> {event.distanceInKm.toFixed(1)} km
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEZIONE CATEGORIE: Stile "Tile / Bento Box" */}
      <section>
        <h2 style={{ color: 'white', margin: '0 0 25px 0', fontSize: '1.5rem' }}>Esplora per Categoria</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
          gap: '20px' 
        }}>
          {categories.map((cat, i) => (
            <Link 
              to={cat.path} 
              key={i} 
              style={{ 
                textDecoration: 'none', 
                backgroundColor: '#1E1E1E', 
                borderRadius: '16px', 
                padding: '24px', 
                color: 'white', 
                border: '1px solid #333',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '140px', 
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => { 
                e.currentTarget.style.borderColor = '#4DA8DA'; 
                e.currentTarget.style.transform = 'translateY(-5px)'; 
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)'; 
              }}
              onMouseOut={(e) => { 
                e.currentTarget.style.borderColor = '#333'; 
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <i className={`fas ${cat.icon}`} style={{ color: '#4DA8DA', fontSize: '2.2rem', marginBottom: '20px' }}></i>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '600' }}>{cat.title}</h3>
                <p style={{ color: '#aaa', fontSize: '0.85rem', margin: '8px 0 0 0', lineHeight: '1.3' }}>{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;