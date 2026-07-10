import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errore, setErrore] = useState('');
  const [successo, setSuccesso] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const haMaiuscola = /[A-Z]/.test(password);
    const haNumero = /[0-9]/.test(password);
    const haSpeciale = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!haMaiuscola || !haNumero || !haSpeciale) {
      setErrore("La nuova password deve contenere almeno 1 maiuscola, 1 numero e 1 carattere speciale.");
      return;
    }

    if (password !== confirmPassword) {
      setErrore("Le password inserite non corrispondono.");
      return;
    }

    const token = searchParams.get('token');

    if (!token) {
      setErrore("Link non valido o scaduto. Usa il link completo che hai ricevuto per email.");
      return;
    }

    setErrore('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: token, 
          newPassword: password 
        })
      });

      if (response.ok) {
        setSuccesso(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        const errorData = await response.json();
        
        if (errorData.message) {
          setErrore(errorData.message);
        } else if (Array.isArray(errorData)) {
          setErrore(errorData[0].ErrorMessage || "La password non rispetta i criteri di sicurezza.");
        } else {
          setErrore("Si è verificato un errore durante il reset. Riprova.");
        }
      }
    } catch (err) {
      setErrore("Impossibile connettersi al server. Verifica la tua connessione.");
    } finally {
      setIsLoading(false);
    }
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

      {!successo && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nuova Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Salvataggio in corso..." : "Reimposta Password"}
          </button>
        </form>
      )}
      
      <div className="auth-links" style={{ marginTop: '20px' }}>
        <Link to="/login">Torna al Login</Link>
      </div>
    </div>
  );
}

export default ResetPassword;