import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function Questionnaire() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // 1. Fetch categorie disponibili dal database
        const catRes = await fetch(`${API_BASE_URL}/api/UserPreferences/available-categories?municipalityId=6c44abbd-72f1-4906-b22a-467cc97cf7b6`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!catRes.ok) throw new Error("Errore nel caricamento categorie");
        const catData = await catRes.json();
        setAvailableCategories(catData);

        // 2. Fetch preferenze attuali dell'utente
        const prefRes = await fetch(`${API_BASE_URL}/api/UserPreferences/getMyPreferences`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (prefRes.ok) {
          const prefData = await prefRes.json();
          setSelected(prefData.map(p => p.category));
        }
      } catch (e) { 
        console.error("Errore inizializzazione:", e); 
      }
      setLoading(false);
    };
    init();
  }, [navigate]);

  const toggleSelection = (type) => {
    setSelected(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    
    const payload = {
      Preferences: selected.map(cat => ({ 
        Category: cat, 
        SubType: null, 
        Weight: 1.0 
      }))
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/UserPreferences/saveMyPreferences`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        navigate('/home');
      } else {
        const err = await response.json();
        console.error("Errore salvataggio backend:", err);
      }
    } catch (e) {
      console.error("Errore di rete:", e);
    }
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>Caricamento...</div>;

  return (
    <div style={{ padding: '60px 20px', color: 'white', maxWidth: '800px', margin: '0 auto', fontFamily: 'inherit' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', letterSpacing: '-0.5px' }}>I tuoi Interessi</h1>
        <p style={{ color: '#aaa', margin: 0, fontSize: '1.1rem' }}>Seleziona cosa ti piace per personalizzare l'esperienza.</p>
      </header>

      {/* GRIGLIA INTERESSI RESPONSIVE */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '50px' 
      }}>
        {availableCategories.map(cat => {
          const isSelected = selected.includes(cat);
          return (
            <button 
              key={cat} 
              onClick={() => toggleSelection(cat)}
              style={{ 
                padding: '20px', 
                backgroundColor: isSelected ? '#4DA8DA' : '#1E1E1E',
                color: isSelected ? '#000' : 'white', 
                border: isSelected ? '2px solid #4DA8DA' : '1px solid #333', 
                borderRadius: '16px', 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: isSelected ? '700' : '500',
                fontSize: '1rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                minHeight: '80px',
                boxShadow: isSelected ? '0 4px 15px rgba(77, 168, 218, 0.3)' : 'none'
              }}
              onMouseOver={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = '#4DA8DA';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseOut={(e) => {
                if (!isSelected) e.currentTarget.style.borderColor = '#333';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <button 
        onClick={handleSubmit} 
        style={{ 
          width: '100%', 
          padding: '18px', 
          backgroundColor: '#4DA8DA', 
          color: '#000',
          border: 'none', 
          borderRadius: '12px', 
          fontWeight: 'bold',
          fontSize: '1.1rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 15px rgba(77, 168, 218, 0.2)'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        Salva e Continua &rarr;
      </button>

    </div>
  );
}

export default Questionnaire;