import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const categories = [
    { title: "Articles", icon: "fa-newspaper", path: "/ArticlesList", desc: "News and updates from the municipality" },
    { title: "Art & Culture", icon: "fa-palette", path: "/ArtCultureList", desc: "Museums, exhibitions, and historical heritage" },
    { title: "Eat & Drink", icon: "fa-utensils", path: "/EatDrinkList", desc: "Restaurants, bars, and local flavors" },
    { title: "Entertainment", icon: "fa-ticket-alt", path: "/EntertainmentList", desc: "Cinemas, theaters, and leisure activities" },
    { title: "Events", icon: "fa-calendar-check", path: "/EventsList", desc: "What to do in the city this week" },
    { title: "Nature", icon: "fa-leaf", path: "/nature", desc: "Parks, reserves, and green areas" },
    { title: "Map", icon: "fa-map-marked-alt", path: "/map", desc: "Explore the area interactively" },
    { title: "Routes", icon: "fa-route", path: "/RoutesList", desc: "Tourist itineraries and trails" },
    { title: "Organizations", icon: "fa-sitemap", path: "/OrganizationsList", desc: "Institutions, associations, and services" },
    { title: "Sleep Accommodation", icon: "fa-hotel", path: "/SleepAccommodationList", desc: "Hotels, B&Bs, and welcoming places to stay" },
    { title: "Shopping", icon: "fa-shopping-bag", path: "/ShoppingList", desc: "Stores, boutiques, and local products" },
    { title: "Map", icon: "fa-map-marked-alt", path: "/map", desc: "Explore the area interactively" }
  ];

  return (
    <div style={{ 
      padding: '60px 20px', 
      maxWidth: '1100px', 
      margin: '0 auto', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center' 
    }}>
      <header style={{ marginBottom: '50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginBottom: '15px' }}>Welcome to Eppoi</h1>
        <p style={{ color: '#CCCCCC', fontSize: '1.1rem' }}>Explore everything our territory has to offer.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '40px', // Spaziatura principale della griglia
        width: '100%'
      }}>
        {categories.map((cat, index) => (
          /* Abbiamo rimosso il div interno, ora il Link STESSO è la card */
          <Link to={cat.path} key={index} style={{ 
            textDecoration: 'none',
            backgroundColor: '#1E1E1E', 
            borderRadius: '12px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px 20px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
            border: '1px solid #333',
            marginBottom: '40px' // Rete di sicurezza per forzare lo spazio verticale
          }}>
            <div style={{ 
              fontSize: '2.5rem', 
              color: '#4DA8DA', 
              marginBottom: '20px' 
            }}>
              <i className={`fas ${cat.icon}`}></i>
            </div>
            <h3 style={{ marginBottom: '12px', color: '#FFFFFF', textAlign: 'center' }}>{cat.title}</h3>
            <p style={{ 
              fontSize: '0.95rem', 
              color: '#AAAAAA', 
              textAlign: 'center',
              lineHeight: '1.4',
              margin: '0' 
            }}>
              {cat.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;