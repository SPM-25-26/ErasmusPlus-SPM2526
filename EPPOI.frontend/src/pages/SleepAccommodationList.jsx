import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const dummyAccommodations = [
  {
    id: "0515f19a-e5f9-4119-8e23-63398bb267f1",
    name: "Placeholder Hotel Name",
    classification: "3.0", 
    typology: "Albergo/Hotel", 
    roomTypologies: ["Single Room", "Double Room", "Family Suite"],
    shortAddress: "52, Via Nazario Sauro, Marano", 
    excerpt: "Comfortable stay located in a strategic position, offering panoramic views and modern amenities for travelers.",
    imagePath: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
  },
  {
    id: "demo-sleep-2",
    name: "Sea Breeze Bed & Breakfast",
    classification: "4.0",
    typology: "B&B",
    roomTypologies: ["Standard Double", "Deluxe Sea View"],
    shortAddress: "10, Lungomare Centro",
    excerpt: "A charming and cozy bed & breakfast just a few steps away from the golden sand and local attractions.",
    imagePath: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80"
  }
];

function SleepAccommodationList() {
  const [places, setPlaces] = useState(dummyAccommodations);


  const renderStars = (rating) => {
    const numStars = Math.floor(parseFloat(rating));
    return Array.from({ length: numStars }, (_, i) => (
      <i key={i} className="fas fa-star" style={{ color: '#F5B041', marginRight: '2px', fontSize: '0.9rem' }}></i>
    ));
  };

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      
      <Link to="/home" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Home
      </Link>

      <header style={{ marginBottom: '50px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginBottom: '15px' }}>Where to Sleep</h1>
        <p style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>Find hotels, B&Bs, and cozy accommodations for your stay.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '40px' 
      }}>
        {places.map((place) => (
          <Link to={`/SleepAccommodationDetail/${place.id}`} key={place.id} style={{ 
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
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {place.typology}
                </span>
                <div style={{ display: 'flex' }}>
                  {renderStars(place.classification)}
                </div>
              </div>

              <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '1.4rem', lineHeight: '1.3' }}>
                {place.name}
              </h3>
              
              <div style={{ color: '#AAAAAA', fontSize: '0.85rem', marginBottom: '15px' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '5px', color: '#4DA8DA' }}></i>
                {place.shortAddress}
              </div>

              <p style={{ color: '#AAAAAA', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px 0', flexGrow: 1 }}>
                {place.excerpt}
              </p>
              
              <div style={{ color: '#4DA8DA', fontWeight: 'bold', fontSize: '0.9rem', marginTop: 'auto', textAlign: 'right' }}>
                Book & Details &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SleepAccommodationList;