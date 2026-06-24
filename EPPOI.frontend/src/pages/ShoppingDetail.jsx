import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_BASE_URL = 'https://localhost:7097';
const MEDIA_BASE_URL = 'https://eppoi.io'; // Aggiunta costante media

function ShoppingDetail() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopDetail = async () => {
      try {
        const token = localStorage.getItem('token'); 

        const response = await fetch(`${API_BASE_URL}/api/pois/shopping/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          throw new Error("Negozio non trovato.");
        }
        if (!response.ok) {
          throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        setShop(data);
      } catch (err) {
        console.error("Errore caricamento dettaglio Shopping:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchShopDetail();
    }
  }, [id]);

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>Caricamento...</div>;
  if (error) return <div style={{ color: '#ef5350', textAlign: 'center', padding: '50px', fontSize: '1.2rem' }}>{error}</div>;
  if (!shop) return null;

  return (
    <div style={{ padding: '60px 20px', maxWidth: '800px', margin: '0 auto' }}>
      
      <Link to="/ShoppingList" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '30px', fontWeight: 'bold' }}>
        &larr; Back to Shopping
      </Link>

      <article>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {shop.poiCategory && (
              <span style={{ backgroundColor: '#2A2A2A', color: '#4DA8DA', padding: '6px 14px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {shop.poiCategory}
              </span>
            )}
          </div>
          
          <h1 style={{ fontSize: '3.5rem', color: '#FFFFFF', marginBottom: '15px', lineHeight: '1.1' }}>
            {shop.officialName}
          </h1>
          
          {shop.address && (
            <div style={{ color: '#AAAAAA', fontSize: '1.1rem', marginBottom: '20px' }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: '8px', color: '#4DA8DA' }}></i>
              {shop.address}
            </div>
          )}
        </header>

        <img 
          src={shop.primaryImagePath ? `${MEDIA_BASE_URL}${shop.primaryImagePath}` : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'} 
          alt={shop.officialName} 
          style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px', marginBottom: '40px', boxShadow: '0 8px 20px rgba(0,0,0,0.6)' }} 
        />

        {shop.description && (
          <div style={{ color: '#E0E0E0', fontSize: '1.15rem', lineHeight: '1.8', marginBottom: '50px' }}>
            <p>{shop.description}</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginBottom: '50px' }}>
          {/* Sezione Info Negozio */}
          <section style={{ backgroundColor: '#1E1E1E', padding: '30px', borderRadius: '12px', border: '1px solid #333' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', marginBottom: '20px' }}>Store Information</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: '#AAAAAA', fontSize: '1.05rem', lineHeight: '2' }}>
              {shop.telephone && (
                <li><i className="fas fa-phone" style={{ color: '#4DA8DA', width: '25px' }}></i> {shop.telephone}</li>
              )}
              {shop.email && (
                <li><i className="fas fa-envelope" style={{ color: '#4DA8DA', width: '25px' }}></i> {shop.email}</li>
              )}
              {shop.website && (
                <li><i className="fas fa-globe" style={{ color: '#4DA8DA', width: '25px' }}></i> <a href={shop.website} target="_blank" rel="noreferrer" style={{ color: '#4DA8DA', textDecoration: 'none' }}>Website</a></li>
              )}
              
              {(shop.facebook || shop.instagram) && (
                <li style={{ marginTop: '15px' }}>
                  {shop.instagram && (
                    <a href={shop.instagram} target="_blank" rel="noreferrer" style={{ marginRight: '15px' }}>
                      <i className="fab fa-instagram" style={{ color: '#E1306C', fontSize: '1.5rem' }}></i>
                    </a>
                  )}
                  {shop.facebook && (
                    <a href={shop.facebook} target="_blank" rel="noreferrer">
                      <i className="fab fa-facebook" style={{ color: '#1877F2', fontSize: '1.5rem' }}></i>
                    </a>
                  )}
                </li>
              )}
            </ul>
          </section>
        </div>

        {/* Prodotti Tipici */}
        {shop.typicalProducts && shop.typicalProducts.length > 0 && (
          <section style={{ backgroundColor: '#2A2A2A', padding: '30px', borderRadius: '12px', border: '1px solid #4DA8DA' }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.8rem', marginBottom: '20px' }}>Typical Products</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              {shop.typicalProducts.map((product, index) => (
                <div key={index} style={{ backgroundColor: '#1E1E1E', padding: '15px', borderRadius: '8px', border: '1px solid #333' }}>
                  <h4 style={{ color: '#f5b041', margin: '0 0 10px 0', fontSize: '1.1rem' }}>
                    {product.name || "Local Product"}
                  </h4>
                  {product.description && <p style={{ color: '#AAAAAA', fontSize: '0.9rem', margin: 0 }}>{product.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

      </article>
    </div>
  );
}

export default ShoppingDetail;