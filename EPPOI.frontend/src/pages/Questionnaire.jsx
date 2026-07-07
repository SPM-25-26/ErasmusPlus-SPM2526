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
        const catRes = await fetch(`${API_BASE_URL}/api/UserPreferences/available-categories?municipalityId=6c44abbd-72f1-4906-b22a-467cc97cf7b6`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!catRes.ok) throw new Error("Errore nel caricamento categorie");
        const catData = await catRes.json();
        setAvailableCategories(catData);

        // 2. Fetch preferenze attuali
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

  if (loading) return <div style={{ color: 'white', textAlign: 'center' }}>Caricamento...</div>;

  return (
    <div style={{ padding: '60px 20px', color: 'white', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Personalizza la tua esperienza</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '40px' }}>
        {availableCategories.map(cat => (
          <button key={cat} onClick={() => toggleSelection(cat)}
            style={{ 
              padding: '15px', 
              backgroundColor: selected.includes(cat) ? '#4DA8DA' : '#1E1E1E',
              color: 'white', border: '1px solid #333', borderRadius: '8px', cursor: 'pointer'
            }}>
            {cat}
          </button>
        ))}
      </div>
      <button onClick={handleSubmit} style={{ width: '100%', padding: '15px', backgroundColor: '#4DA8DA', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
        Salva e Continua &rarr;
      </button>
    </div>
  );
}
export default Questionnaire;