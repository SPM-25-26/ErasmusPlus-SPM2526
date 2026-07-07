import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';

function VerifyEmail() {
  // 1. Catturiamo il token dall'URL (es: ?token=eyJhbGci...)
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // 2. Definiamo 4 stati possibili della nostra pagina
  // Se c'è un token nell'URL, partiamo in 'loading', altrimenti in 'idle' (attesa)
  const [status, setStatus] = useState(token ? 'loading' : 'idle');

  // 3. Questo hook scatta da solo appena si apre la pagina
  useEffect(() => {
    // Se c'è un token, facciamo subito la chiamata al backend
    if (token) {
      const verifyToken = async () => {
        try {
          // Facciamo la GET all'URL esatto indicato dal tuo compagno
          const response = await fetch(`${API_BASE_URL}/api/auth/verify-email?token=${token}`, {
            method: 'GET',
            headers: {
              'Accept': 'text/html' // Richiesto dal documento
            }
          });

          if (response.ok) {
            // Status 200: Token valido, account attivato!
            setStatus('success');
          } else {
            // Token scaduto o manomesso
            setStatus('error');
          }
        } catch (error) {
          console.error("Errore di rete:", error);
          setStatus('error');
        }
      };

      verifyToken();
    }
  }, [token]);

  return (
    <div className="auth-card" style={{ textAlign: 'center' }}>
      
      {/* STATO 1: L'utente si è appena registrato e aspetta la mail */}
      {status === 'idle' && (
        <>
          <h2>Controlla la tua Email</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Ti abbiamo inviato un link di verifica. Cliccalo per attivare il tuo account.
          </p>
          <button className="btn-primary" style={{ backgroundColor: 'transparent', border: '1px solid var(--accent-color)' }}>
            Invia di nuovo
          </button>
        </>
      )}

      {/* STATO 2: L'utente ha cliccato il link e stiamo parlando col backend */}
      {status === 'loading' && (
        <>
          <h2>Verifica in corso...</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Stiamo convalidando il tuo account, attendi un istante...
          </p>
        </>
      )}

      {/* STATO 3: Il backend ci ha detto che è tutto ok (response.ok) */}
      {status === 'success' && (
        <>
          <h2 style={{ color: '#4ade80' }}>Email Verificata!</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Il tuo account è stato attivato con successo. Ora puoi accedere.
          </p>
        </>
      )}

      {/* STATO 4: Il token era falso o sono passate più di 24 ore */}
      {status === 'error' && (
        <>
          <h2 style={{ color: '#ff4d4d' }}>Link non valido</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
            Il link di verifica non è valido o è scaduto. Riprova a fare il login per ricevere un nuovo link.
          </p>
        </>
      )}

      <div className="auth-links" style={{ marginTop: '20px' }}>
        <Link to="/login">Torna al Login</Link>
      </div>
    </div>
  );
}

export default VerifyEmail;