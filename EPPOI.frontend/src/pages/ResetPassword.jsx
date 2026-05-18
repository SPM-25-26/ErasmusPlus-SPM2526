import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errore, setErrore] = useState('');
  const [successo, setSuccesso] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Controllo robustezza password (le stesse regole della registrazione)
    const haMaiuscola = /[A-Z]/.test(password);
    const haNumero = /[0-9]/.test(password);
    const haSpeciale = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!haMaiuscola || !haNumero || !haSpeciale) {
      setErrore("La nuova password deve contenere almeno 1 maiuscola, 1 numero e 1 carattere speciale.");
      return;
    }

    // 2. Controllo di corrispondenza tra i due campi
    if (password !== confirmPassword) {
      setErrore("Le password inserite non corrispondono.");
      return;
    }

    // Se i controlli passano
    setErrore('');
    setSuccesso(true);

    // Simuliamo un reindirizzamento al login dopo 3 secondi dal successo
    setTimeout(() => {
      navigate('/login');
    }, 3000);
  };

  return (
    <div className="auth-card">
      <h2>Nuova Password</h2>
      
      {errore && (
        <div style={{ color: '#ff4d4d', backgroundColor: '#331a1a', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid #ff4d4d' }}>
          {errore}
        </div>
      )}

      {successo && (
        <div style={{ color: '#28a745', backgroundColor: '#1a331e', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid #28a745' }}>
          Password aggiornata con successo! Verrai reindirizzato al login...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nuova Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            required 
            disabled={successo}
          />
        </div>

        <div className="form-group">
          <label>Conferma Nuova Password</label>
          <input 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••" 
            required 
            disabled={successo}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={successo}>
          Reimposta Password
        </button>
      </form>
      
      <div className="auth-links">
        <Link to="/login">Torna al Login</Link>
      </div>
    </div>
  );
}

export default ResetPassword;