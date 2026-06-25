import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://localhost:7097';
const MEDIA_BASE_URL = 'https://eppoi.io';

function Home() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  
  const [allFilteredEvents, setAllFilteredEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const initPage = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const statusRes = await fetch(`${API_BASE_URL}/api/UserPreferences/status`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statusData = await statusRes.json();

        if (!statusData.hasCompleted) {
          navigate('/questionnaire');
          return;
        }

        const feedRes = await fetch(`${API_BASE_URL}/api/UserPreferences/discover?municipalityId=6c44abbd-72f1-4906-b22a-467cc97cf7b6`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dbData = await feedRes.json();
        console.log("Totale elementi dal backend:", dbData.length); 
        setAllFilteredEvents(dbData);
        setDisplayedEvents(dbData.slice(0, visibleCount));
        setIsChecking(false);
      } catch (error) {
        console.error("Errore:", error);
        setIsChecking(false);
      }
    };

    initPage();
  }, [navigate]);

  const loadMoreItems = () => {
    if (loadingMore || displayedEvents.length >= allFilteredEvents.length) return;
    
    setLoadingMore(true);
    
    const nextCount = visibleCount + 4;
    setVisibleCount(nextCount);
    
    setDisplayedEvents(allFilteredEvents.slice(0, nextCount));
    
    setLoadingMore(false);
  };

  const handleScroll = (e) => {
    const container = e.currentTarget;
    if (container.scrollHeight - container.scrollTop <= container.clientHeight + 50) {
      loadMoreItems();
    }
  };

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
    { title: "Shopping", icon: "fa-shopping-bag", path: "/ShoppingList", desc: "Local products" },
    { title: "Map", icon: "fa-map-marked-alt", path: "/map", desc: "Interactive map" }
  ];

  if (isChecking) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Verifica autorizzazioni...</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1350px', margin: '0 auto', position: 'relative' }}>
      
      <button onClick={() => navigate('/questionnaire')} style={{ position: 'absolute', top: '40px', right: '20px', backgroundColor: '#1E1E1E', border: '1px solid #333', color: '#4DA8DA', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>
        <i className="fas fa-sliders-h"></i> Interessi
      </button>

      <header style={{ marginBottom: '50px', textAlign: 'center' }}>
        <h1 style={{ color: 'white' }}>Welcome to Eppoi</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '40px' }}>
        {/* Griglia Categorie */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
          {categories.map((cat, i) => (
            <Link to={cat.path} key={i} style={{ textDecoration: 'none', backgroundColor: '#1E1E1E', borderRadius: '12px', padding: '25px', color: 'white', border: '1px solid #333' }}>
              <i className={`fas ${cat.icon}`} style={{ color: '#4DA8DA', fontSize: '1.5rem', marginBottom: '10px' }}></i>
              <h3>{cat.title}</h3>
              <p style={{ color: '#aaa', fontSize: '0.8rem' }}>{cat.desc}</p>
            </Link>
          ))}
        </div>

        {/* Sidebar Consigliati */}
        <aside style={{ backgroundColor: '#1E1E1E', borderRadius: '12px', padding: '18px', position: 'sticky', top: '40px', border: '1px solid #333' }}>
          <h3 style={{ color: 'white', marginBottom: '15px' }}>Consigliati</h3>
          
          <div ref={scrollContainerRef} onScroll={handleScroll} style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
          {displayedEvents.map(event => {
            const path = event.entityType === 'Sleep' 
              ? `/SleepAccommodationDetail/${event.id}` 
              : `/${event.entityType}Detail/${event.id}`;

            return (
              <Link 
                to={path} 
                key={event.id} 
                style={{ textDecoration: 'none', display: 'flex', gap: '10px', marginBottom: '15px', padding: '10px', backgroundColor: '#252525', borderRadius: '8px', border: '1px solid #333' }}
              >
                <img 
                  src={event.imagePath ? `${MEDIA_BASE_URL}${event.imagePath}` : "https://via.placeholder.com/60"} 
                  style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover' }} 
                  alt={event.title} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4 style={{ color: 'white', margin: 0, fontSize: '0.9rem' }}>{event.title}</h4>
                  {event.distanceInKm && <span style={{ color: '#81C784', fontSize: '0.8rem' }}>{event.distanceInKm.toFixed(1)} km</span>}
                </div>
              </Link>
            );
          })}
          </div>

          <div style={{ color: 'white', fontSize: '0.7rem', marginTop: '10px' }}>
            Visualizzati: {displayedEvents.length} di {allFilteredEvents.length}
          </div>

          {displayedEvents.length < allFilteredEvents.length && (
            <button 
              onClick={loadMoreItems}
              style={{ width: '100%', padding: '10px', marginTop: '10px', backgroundColor: '#4DA8DA', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'white', fontWeight: 'bold' }}
            >
              Mostra Altri
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Home;