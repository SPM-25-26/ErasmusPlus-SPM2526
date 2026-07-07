import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import { API_BASE_URL } from '../config';
import L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MUNICIPALITY_ID = '6c44abbd-72f1-4906-b22a-467cc97cf7b6';

function InteractiveMap() {
  const [pois, setPois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapCenter = [43.1606, 13.7183]; 
  const zoomLevel = 14;

  useEffect(() => {
    document.body.classList.add('map-page-body');
  
    return () => {
      document.body.classList.remove('map-page-body');
    };
  }, []);

  useEffect(() => {
    const fetchMapPois = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await fetch(`${API_BASE_URL}/api/Map/pois?municipalityId=${MUNICIPALITY_ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);

        const data = await response.json();
        setPois(data);
      } catch (err) {
        console.error("Errore caricamento mappa:", err);
        setError("Impossibile caricare i punti sulla mappa.");
      } finally {
        setLoading(false);
      }
    };

    fetchMapPois();
  }, []);

  const getDetailPath = (category, id) => {
    switch (category) {
      case 'ArtCulture': return `/ArtCultureDetail/${id}`;
      case 'EatDrink': return `/EatDrinkDetail/${id}`;
      case 'Entertainment': return `/EntertainmentDetail/${id}`;
      case 'Shopping': return `/ShoppingDetail/${id}`;
      case 'Sleep': return `/SleepAccommodationDetail/${id}`;
      case 'Event': return `/EventsDetail/${id}`;
      default: return '#'; 
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'ArtCulture': return { text: 'Art & Culture', color: '#8E44AD' };
      case 'EatDrink': return { text: 'Eat & Drink', color: '#E67E22' };
      case 'Entertainment': return { text: 'Entertainment', color: '#E74C3C' };
      case 'Shopping': return { text: 'Shopping', color: '#2ECC71' };
      case 'Sleep': return { text: 'Accommodation', color: '#3498DB' };
      default: return { text: 'Point of Interest', color: '#95A5A6' };
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', padding: '100px' }}>Caricamento Mappa...</div>;
  if (error) return <div style={{ color: '#ef5350', textAlign: 'center', padding: '100px' }}>{error}</div>;

  return (
    <div style={{ padding: '40px 20px', width: '100%', boxSizing: 'border-box' }}>
      <Link to="/home" style={{ color: '#4DA8DA', textDecoration: 'none', display: 'inline-block', marginBottom: '20px', fontWeight: 'bold' }}>
        &larr; Back to Home
      </Link>

      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#FFFFFF', marginBottom: '10px' }}>Interactive Map</h1>
        <p style={{ color: '#AAAAAA', fontSize: '1.1rem' }}>Explore all points of interest in the area.</p>
      </header>

      <div style={{ 
          height: '70vh', 
          width: '100%', 
          position: 'relative', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          border: '2px solid #333'
      }}>        
        <MapContainer 
            key={pois.length} 
            center={mapCenter} 
            zoom={zoomLevel} 
            style={{ height: '100%', width: '100%' }} 
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {pois.map((poi) => {
            const badge = getCategoryBadge(poi.category);
            const detailPath = getDetailPath(poi.category, poi.id);
            return (
              <Marker key={poi.id} position={[poi.latitude, poi.longitude]}>
                <Popup>
                  <div style={{ textAlign: 'center', padding: '5px', minWidth: '150px' }}>
                    <span style={{ display: 'inline-block', backgroundColor: badge.color, color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', marginBottom: '8px', textTransform: 'uppercase' }}>
                      {badge.text}
                    </span>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#333' }}>{poi.officialName}</h3>
                    {detailPath !== '#' ? (
                      <Link to={detailPath} style={{ display: 'block', backgroundColor: '#4DA8DA', color: 'white', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        View Details
                      </Link>
                    ) : <span>Dettagli non disponibili</span>}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default InteractiveMap;