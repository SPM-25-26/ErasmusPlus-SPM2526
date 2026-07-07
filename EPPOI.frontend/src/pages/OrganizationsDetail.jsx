import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const MEDIA_BASE_URL = 'https://eppoi.io'; 

function OrganizationsDetail() {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizationDetail = async () => {
      try {
        const token = localStorage.getItem('token'); 

        const response = await fetch(`${API_BASE_URL}/api/Organizations/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          throw new Error("Organizzazione non trovata.");
        }
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setOrganization(data);
      } catch (err) {
        console.error("Errore caricamento dettaglio Organization:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrganizationDetail();
    }
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Caricamento...</div>;
  if (error) return <div style={{ color: '#ef5350', textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>{error}</div>;
  if (!organization) return null;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/OrganizationsList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Organizations
      </Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            {organization.type && (
              <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {organization.type}
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '10px', lineHeight: '1.1' }}>
            {organization.legalName}
          </h1>
          {organization.address && (
            <div style={{ color: '#AAAAAA', fontSize: '1.1rem', marginBottom: '20px' }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: '#4DA8DA' }}></i>
              {organization.address}
            </div>
          )}
        </header>

        <img 
          src={organization.primaryImagePath ? `${MEDIA_BASE_URL}${organization.primaryImagePath}` : 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80'} 
          alt={organization.legalName} 
          style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        {organization.description && (
          <div style={{ color: '#E0E0E0', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '50px' }}>
            <p>{organization.description}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          {(organization.telephone || organization.email || organization.website || organization.instagram || organization.facebook) && (
            <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
              <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Contact Information</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2.2' }}>
                {organization.telephone && (
                  <li><i className="fas fa-phone" style={{ color: '#4DA8DA', width: '25px' }}></i> {organization.telephone}</li>
                )}
                {organization.email && (
                  <li><i className="fas fa-envelope" style={{ color: '#4DA8DA', width: '25px' }}></i> {organization.email}</li>
                )}
                {organization.website && (
                  <li><i className="fas fa-globe" style={{ color: '#4DA8DA', width: '25px' }}></i> <a href={organization.website} target="_blank" rel="noreferrer" style={{ color: '#4DA8DA', textDecoration: 'none' }}>Website</a></li>
                )}
                {(organization.instagram || organization.facebook) && (
                  <li style={{ marginTop: '10px' }}>
                    {organization.instagram && (
                      <a href={organization.instagram} target="_blank" rel="noreferrer" style={{ marginRight: '15px' }}>
                        <i className="fab fa-instagram" style={{ color: '#E1306C', fontSize: '1.5rem' }}></i>
                      </a>
                    )}
                    {organization.facebook && (
                      <a href={organization.facebook} target="_blank" rel="noreferrer">
                        <i className="fab fa-facebook" style={{ color: '#1877F2', fontSize: '1.5rem' }}></i>
                      </a>
                    )}
                  </li>
                )}
              </ul>
            </section>
          )}

          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Company Details</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2.2' }}>
              <li><i className="fas fa-id-card" style={{ color: '#4DA8DA', width: '25px' }}></i> Tax Code: <strong>{organization.taxCode}</strong></li>
              {organization.legalStatus && (
                <li><i className="fas fa-balance-scale" style={{ color: '#4DA8DA', width: '25px' }}></i> Status: <strong>{organization.legalStatus}</strong></li>
              )}
              {organization.foundationDate && (
                <li><i className="fas fa-history" style={{ color: '#4DA8DA', width: '25px' }}></i> Founded: <strong>{organization.foundationDate}</strong></li>
              )}
            </ul>
          </section>

        </div>
      </article>
    </div>
  );
}

export default OrganizationsDetail;