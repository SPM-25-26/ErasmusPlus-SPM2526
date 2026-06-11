import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Dati mock strutturati con i campi base (nome, immagine) + i campi specifici (type, subjectDiscipline)
export const dummyArtCulture = [
  {
    id: "071c2007-30af-4c1b-800a-66a625877efe",
    name: "Placeholder Cinema Name",
    type: "Cinema", // Dal tuo DB
    artCultureNatureType: "ArtCulture",
    subjectDiscipline: "Film & Media",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    imagePath: "https://via.placeholder.com/800x400/1E1E1E/4DA8DA?text=Cinema+Image"
  },
  {
    id: "demo-art-2",
    name: "Example City Museum",
    type: "Museum",
    artCultureNatureType: "ArtCulture",
    subjectDiscipline: "Contemporary Art",
    excerpt: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    imagePath: "https://via.placeholder.com/800x400/1E1E1E/4DA8DA?text=Museum+Image"
  },
  {
    id: "demo-art-3",
    name: "Historic Theater",
    type: "Theater",
    artCultureNatureType: "ArtCulture",
    subjectDiscipline: "Performing Arts",
    excerpt: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    imagePath: "https://via.placeholder.com/800x400/1E1E1E/4DA8DA?text=Theater+Image"
  }
];

function ArtCultureList() {
  const [places, setPlaces] = useState(dummyArtCulture);

  return (

    

    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>

      <Link to="/home" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Home
      </Link>
      
      <header style={{ marginBottom: '50px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginBottom: '15px' }}>Art & Culture</h1>
        <p style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>Discover museums, cinemas, and historical sites.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '40px' 
      }}>
        {places.map((place) => (
          <Link to={`/ArtCultureDetail/${place.id}`} key={place.id} style={{ 
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
              alt="placeholder" 
              style={{ width: '100%', height: '220px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <span style={{ 
                  backgroundColor: '#2A2A2A', 
                  color: '#4DA8DA', 
                  padding: '4px 10px', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem', 
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  {place.type}
                </span>
              </div>
              <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '1.4rem', lineHeight: '1.3' }}>
                {place.name}
              </h3>
              <p style={{ color: '#AAAAAA', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px 0', flexGrow: 1 }}>
                {place.excerpt}
              </p>
              <div style={{ color: '#4DA8DA', fontWeight: 'bold', fontSize: '0.9rem' }}>
                View Details &rarr;
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ArtCultureList;