import React from 'react';
import { Link } from 'react-router-dom';

function VerifyEmail() {
  return (
    <div className="auth-card" style={{ textAlign: 'center' }}>
      <h2>Controlla la tua Email</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        Ti abbiamo inviato un link di verifica. Cliccalo per attivare il tuo account.
      </p>
      <button className="btn-primary" style={{ backgroundColor: 'transparent', border: '1px solid var(--accent-color)' }}>
        Invia di nuovo
      </button>
      <div className="auth-links" style={{ marginTop: '20px' }}>
        <Link to="/login">Torna al Login</Link>
      </div>
    </div>
  );
}

export default VerifyEmail;