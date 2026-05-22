import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  // 1. Definiamo gli stati per l'input, il messaggio di successo, l'errore e il caricamento
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 2. Funzione per gestire l'invio del form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene il ricaricamento della pagina
    setMessage('');
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://localhost:7097/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email }) // Il backend si aspetta la chiave "email"
      });

      if (response.ok) {
        // Il backend risponde sempre con 200 OK per sicurezza, quindi mostriamo il messaggio generico richiesto
        setMessage("Se l'email esiste, ti abbiamo inviato un link per reimpostare la password.");
        setEmail(''); // Svuota l'input
      } else {
        // In caso di crash del server o bad request
        setError("Si è verificato un errore durante l'invio. Riprova più tardi.");
      }
    } catch (err) {
      setError("Impossibile connettersi al server. Verifica la tua connessione.");
    } finally {
      setIsLoading(false); // Riabilita il bottone
    }
  };

  return (
    <div className="auth-card">
      <h2>Recupera Password</h2>
      
      {/* 3. Mostriamo il messaggio di successo se l'operazione è andata a buon fine */}
      {message && (
        <div style={{ color: '#4ade80', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
          {message}
        </div>
      )}

      {/* 4. Mostriamo un eventuale errore di rete */}
      {error && (
        <div style={{ color: '#ff4d4d', marginBottom: '20px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* 5. Se il messaggio c'è, nascondiamo il form per un look più pulito */}
      {!message && (
        <>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
            Inserisci la tua email e ti invieremo un link per reimpostare la password.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="mario@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading} // Disabilita l'input mentre carica
              />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Invio in corso...' : 'Invia Link'}
            </button>
          </form>
        </>
      )}

      <div className="auth-links" style={{ marginTop: '20px' }}>
        <Link to="/login">Torna al Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;