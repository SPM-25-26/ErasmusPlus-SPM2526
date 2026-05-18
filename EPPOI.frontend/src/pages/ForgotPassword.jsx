import React from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  return (
    <div className="auth-card">
      <h2>Recupera Password</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
        Inserisci la tua email e ti invieremo un link per reimpostare la password.
      </p>
      <form>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="mario@email.com" />
        </div>
        <button type="submit" className="btn-primary">Invia Link</button>
      </form>
      <div className="auth-links">
        <Link to="/login">Torna al Login</Link>
      </div>
    </div>
  );
}

export default ForgotPassword;