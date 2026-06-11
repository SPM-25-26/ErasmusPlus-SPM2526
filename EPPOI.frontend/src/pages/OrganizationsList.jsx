import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const dummyOrganizations = [
  {
    id: "00287410443", 
    legalName: "Camping Led Zeppelin S.R.L.",
    type: "Camping & RV Areas", 
    address: "5, Contrada Boccabianca",
    description: "Modern camping facility offering the benefits of a tourist village. Located between the blue sea and the beautiful hills, with a private beach.",
    primaryImagePath: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800&q=80",
    telephone: "0735 778125"
  },
  {
    id: "demo-org-2",
    legalName: "City Tourist Board",
    type: "Public Service",
    address: "Piazza della Libertà 1",
    description: "Official tourist information center. We provide maps, guided tour bookings, and assistance for all visitors.",
    primaryImagePath: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    telephone: "0735 123456"
  },
  {
    id: "demo-org-3",
    legalName: "Cultural Association 'Il Borgo'",
    type: "Non-Profit Organization",
    address: "Via Roma 42",
    description: "Local association dedicated to preserving historical traditions and organizing neighborhood festivals.",
    primaryImagePath: "https://images.unsplash.com/photo-1577415124269-fc1140a69e91?w=800&q=80",
    telephone: "0735 987654"
  }
];

function OrganizationsList() {
  const [organizations, setOrganizations] = useState(dummyOrganizations);

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1100px', margin: '0 auto' }}>
      
      <Link to="/home" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Home
      </Link>

      <header style={{ marginBottom: '50px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
        <h1 style={{ fontSize: '2.8rem', color: '#FFFFFF', marginBottom: '15px' }}>Organizations & Services</h1>
        <p style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>Find local businesses, institutions, and useful services.</p>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '40px' 
      }}>
        {organizations.map((org) => (
          <Link to={`/OrganizationsDetail/${org.id}`} key={org.id} style={{ 
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
              src={org.primaryImagePath} 
              alt={org.legalName} 
              style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
            />
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              
              <div style={{ marginBottom: '15px' }}>
                <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {org.type}
                </span>
              </div>

              <h3 style={{ color: '#FFFFFF', marginBottom: '10px', fontSize: '1.4rem', lineHeight: '1.3' }}>
                {org.legalName}
              </h3>
              
              <div style={{ color: '#AAAAAA', fontSize: '0.85rem', marginBottom: '15px' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '5px', color: '#4DA8DA' }}></i>
                {org.address}
              </div>

              <p style={{ color: '#AAAAAA', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 20px 0', flexGrow: 1 }}>
                {org.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid #333', paddingTop: '15px' }}>
                <span style={{ color: '#E0E0E0', fontSize: '0.9rem' }}>
                  <i className="fas fa-phone" style={{ marginRight: '5px', color: '#4DA8DA' }}></i> {org.telephone}
                </span>
                <span style={{ color: '#4DA8DA', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Profile &rarr;
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default OrganizationsList;