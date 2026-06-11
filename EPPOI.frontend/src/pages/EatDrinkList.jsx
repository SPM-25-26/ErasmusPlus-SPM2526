import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const dummyEatDrink = [
  {
    id: "4e6a8ea5-b464-4777-8106-67e62fd04720",
    name: "La Tradizione",
    type: "Diner / Hot Food", 
    dietaryNeeds: ["Vegetarian Friendly", "Lactose Free", "Gluten Free"],
    excerpt: "Authentic local flavors served fast. Perfect for a quick lunch break during your city tour.",
    imagePath: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    openingHours: "Mon-Sat: 11:30 AM - 3:30 PM"
  },
  {
    id: "demo-eat-2",
    name: "Ocean View Seafood",
    type: "Restaurant",
    dietaryNeeds: ["Gluten Free Options"],
    excerpt: "Premium seafood restaurant offering the catch of the day with an incredible coastal view.",
    imagePath: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
    openingHours: "Tue-Sun: 7:00 PM - 11:00 PM"
  },
  {
    id: "demo-eat-3",
    name: "Central Hub Cafe",
    type: "Cafe & Bar",
    dietaryNeeds: ["Vegan Options", "Vegetarian Friendly"],
    excerpt: "Artisanal coffee, fresh pastries, and signature cocktails in the heart of the historic center.",
    imagePath: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    openingHours: "Everyday: 7:00 AM - 12:00 AM"
  }
];

function EatDrinkList() {
  const [places, setPlaces] = useState(dummyEatDrink);

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      <Link to="/home" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Home
      </Link>
      <header style={{ marginBottom: '50px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginBottom: '15px' }}>Eat & Drink</h1>
        <p style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>Discover the best restaurants, cafes, and local flavors.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '40px' 
      }}>
        {places.map((place) => (
          <Link to={`/EatDrinkDetail/${place.id}`} key={place.id} style={{ 
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
              src={place.imagePath} 
              alt={place.name} 
              style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              
              {/* Contenitore per Type e Dietary Needs */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '15px' }}>
                <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {place.type}
                </span>
                {place.dietaryNeeds.slice(0, 2).map((need, idx) => ( // Mostriamo max 2 tag alimentari nella card per non sporcare il design
                  <span key={idx} style={{ backgroundColor: '#1A3320', color: '#81C784', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem' }}>
                    {need}
                  </span>
                ))}
              </div>

              <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '1.4rem', lineHeight: '1.3' }}>
                {place.name}
              </h3>
              <p style={{ color: '#AAAAAA', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px 0', flexGrow: 1 }}>
                {place.excerpt}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                <span style={{ color: '#888888', fontSize: '0.85rem' }}>
                  <i className="far fa-clock" style={{ marginRight: '5px' }}></i> {place.openingHours.split(':')[0]}
                </span>
                <span style={{ color: '#4DA8DA', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Menu & Info &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default EatDrinkList;