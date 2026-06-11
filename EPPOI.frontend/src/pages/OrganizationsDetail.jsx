import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { dummyOrganizations } from './OrganizationsList';

function OrganizationsDetail() {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    const foundOrg = dummyOrganizations.find(o => o.id === id);
    if(foundOrg) {
      setOrganization({
        ...foundOrg,
        email: "contact@example.com",
        website: "https://www.example.com",
        instagram: "@example_insta",
        facebook: "Example Facebook Page",
        legalStatus: "Limited Liability Company"
      });
    }
  }, [id]);

  if (!organization) return <div style={{ color: 'white', textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/OrganizationsList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Organizations
      </Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
              {organization.type}
            </span>
          </div>
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '10px', lineHeight: '1.1' }}>
            {organization.legalName}
          </h1>
          <div style={{ color: '#AAAAAA', fontSize: '1.1rem', marginBottom: '20px' }}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: '#4DA8DA' }}></i>
            {organization.address}
          </div>
        </header>

        <img 
          src={organization.primaryImagePath} 
          alt={organization.legalName} 
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        <div style={{ color: '#E0E0E0', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '50px' }}>
          <p>{organization.description}</p>
        </div>

        {/* Box Contatti e Dettagli Legali */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Contact Information</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2.2' }}>
              <li><i className="fas fa-phone" style={{ color: '#4DA8DA', width: '25px' }}></i> {organization.telephone}</li>
              <li><i className="fas fa-envelope" style={{ color: '#4DA8DA', width: '25px' }}></i> {organization.email}</li>
              <li><i className="fas fa-globe" style={{ color: '#4DA8DA', width: '25px' }}></i> <a href="#" style={{ color: '#4DA8DA', textDecoration: 'none' }}>Website</a></li>
              <li style={{ marginTop: '10px' }}>
                <i className="fab fa-instagram" style={{ color: '#E1306C', fontSize: '1.5rem', marginRight: '15px', cursor: 'pointer' }}></i>
                <i className="fab fa-facebook" style={{ color: '#1877F2', fontSize: '1.5rem', cursor: 'pointer' }}></i>
              </li>
            </ul>
          </section>

          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Company Details</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2.2' }}>
              <li><i className="fas fa-id-card" style={{ color: '#4DA8DA', width: '25px' }}></i> Tax Code: <strong>{organization.id}</strong></li>
              <li><i className="fas fa-balance-scale" style={{ color: '#4DA8DA', width: '25px' }}></i> Status: <strong>{organization.legalStatus}</strong></li>
            </ul>
          </section>

        </div>
      </article>
    </div>
  );
}

export default OrganizationsDetail;