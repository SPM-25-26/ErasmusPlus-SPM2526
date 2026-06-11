import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyArtCulture } from './ArtCultureList';

function ArtCultureDetail() {
  const { id } = useParams();
  const [place, setPlace] = useState(null);

  useEffect(() => {
    const foundPlace = dummyArtCulture.find(p => p.id === id);
    setPlace(foundPlace);
  }, [id]);

  if (!place) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/ArtCultureList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Art & Culture
      </Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {place.type}
            </span>
            {place.subjectDiscipline && (
              <span style={{ backgroundColor: '#2A2A2A', color: '#AAAAAA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem' }}>
                {place.subjectDiscipline}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '20px', lineHeight: '1.1' }}>
            {place.name}
          </h1>
        </header>

        <img 
          src={place.imagePath} 
          alt="POI Visual" 
          style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        <div style={{ color: '#E0E0E0', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '50px' }}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in venenatis enim. 
            Mauris facilisis justo at tellus gravida, vitae varius neque volutpat. 
            Phasellus consequat vehicula nisl, vel blandit est tristique vel.
          </p>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae 
            dicta sunt explicabo.
          </p>
        </div>

        {/* Sezione per info pratiche che si trovano solitamente nei POI (orari, indirizzo) */}
        <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
          <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Visitor Information</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2' }}>
            <li><i className="fas fa-map-marker-alt" style={{ color: '#4DA8DA', width: '25px' }}></i> 123 Placeholder Street, City</li>
            <li><i className="far fa-clock" style={{ color: '#4DA8DA', width: '25px' }}></i> Tue - Sun: 10:00 AM - 6:00 PM</li>
            <li><i className="fas fa-ticket-alt" style={{ color: '#4DA8DA', width: '25px' }}></i> Standard: €10.00 / Reduced: €7.00</li>
            <li><i className="fas fa-phone" style={{ color: '#4DA8DA', width: '25px' }}></i> +39 000 1234567</li>
          </ul>
        </section>
      </article>
    </div>
  );
}

export default ArtCultureDetail;